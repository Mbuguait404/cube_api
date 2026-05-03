import { Injectable, Logger, Inject, forwardRef, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from '../../auth/auth.service';
import { User, UserDocument, UserRole, UserStatus } from '../../users/schemas/user.schema';

@Injectable()
export class CmsBridgeService {
  private readonly logger = new Logger(CmsBridgeService.name);
  private client: AxiosInstance;
  private tenantId: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {
    this.tenantId = config.get<string>('CMS_TENANT_ID') || '';
    this.client = axios.create({
      baseURL: config.get<string>('CMS_BASE_URL'),
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': this.tenantId,
      },
    });
  }

  // ─── Auth (service-account login to CMS) ──────────────────────────────────
  private async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken as string;
    }

    const { data } = await this.client.post('/auth/login', {
      email: this.config.get('CMS_ADMIN_EMAIL'),
      password: this.config.get('CMS_ADMIN_PASSWORD'),
    });

    this.accessToken = data.accessToken;
    this.tokenExpiry = Date.now() + 6 * 60 * 60 * 1000;
    return this.accessToken as string;
  }

  private async authHeaders() {
    const token = await this.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  // ─── Applications ─────────────────────────────────────────────────────────

  /** Pull membership/innovation-challenge applications from CMC */
  async getApplications(params?: { page?: number; limit?: number; status?: string }) {
    try {
      const url = `${this.client.defaults.baseURL}/memberships`;
      this.logger.log(`Fetching from CMS: ${url} (page: ${params?.page || 1}, limit: ${params?.limit || 50})...`);
      const headers = await this.authHeaders();
      const { data } = await this.client.get('/memberships', {
        headers,
        params: { page: params?.page || 1, limit: params?.limit || 50 },
      });

      this.logger.log(`Found ${data.total || 0} applications at /memberships.`);
      // Normalize to Hub's PaginatedResponse structure
      return {
        data: (data.data || []).map((item: any) => ({
          ...item,
          firstName: item.firstName || item.name?.split(' ')[0] || '',
          lastName: item.lastName || item.name?.split(' ').slice(1).join(' ') || '',
          appliedAt: item.appliedAt || item.createdAt || new Date().toISOString(),
        })),
        meta: {
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 50,
          totalPages: data.totalPages || 0,
        },
      };
    } catch (err) {
      this.logger.error(`CMS getApplications failed: ${err.message}`);
      throw err;
    }
  }

  /** Pull membership submissions from CMC */
  async getMemberships(params?: { page?: number; limit?: number }) {
    try {
      const url = `${this.client.defaults.baseURL}/memberships`;
      this.logger.log(`Fetching from CMS: ${url} (page: ${params?.page || 1}, limit: ${params?.limit || 50})...`);
      const headers = await this.authHeaders();
      const { data } = await this.client.get('/memberships', {
        headers,
        params: { page: params?.page || 1, limit: params?.limit || 50 },
      });

      this.logger.log(`Found ${data.total || 0} memberships at /memberships.`);
      return {
        data: (data.data || []).map((item: any) => ({
          ...item,
          firstName: item.firstName || item.name?.split(' ')[0] || '',
          lastName: item.lastName || item.name?.split(' ').slice(1).join(' ') || '',
        })),
        meta: {
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 50,
          totalPages: data.totalPages || 0,
        },
      };
    } catch (err) {
      this.logger.error(`CMS getMemberships failed: ${err.message}`);
      throw err;
    }
  }

  async getApplicationById(id: string) {
    try {
      const headers = await this.authHeaders();
      const { data } = await this.client.get(`/memberships/${id}`, { headers });
      return data;
    } catch (err) {
      this.logger.error(`CMS getApplicationById(${id}) failed: ${err.message}`);
      throw err;
    }
  }

  async getMembershipById(id: string) {
    try {
      const headers = await this.authHeaders();
      const { data } = await this.client.get(`/memberships/${id}`, { headers });
      return data;
    } catch (err) {
      this.logger.error(`CMS getMembershipById(${id}) failed: ${err.message}`);
      throw err;
    }
  }

  /** Import application/membership from CMS into the Hub */
  async importApplication(id: string, type: 'admission' | 'membership' = 'membership') {
    const application = type === 'admission' 
      ? await this.client.get(`/admissions/${id}`, { headers: await this.authHeaders() }).then(r => r.data)
      : await this.getMembershipById(id);
      
    if (!application) throw new NotFoundException(`${type} not found in CMS`);

    const email = application.email.toLowerCase();
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    // Handle name split if only 'name' is provided
    let firstName = application.firstName || '';
    let lastName = application.lastName || '';
    if (!firstName && application.name) {
      const parts = application.name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    // Create the member account
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      phone: application.phone || '',
      institution: application.institution || application.organization || '',
      status: UserStatus.ACTIVE,
      role: UserRole.MEMBER,
      mustChangePassword: true,
      isFirstLogin: true,
    });

    // Generate and send temporary password via email
    const authResult = await this.authService.sendTemporaryPassword(user._id.toString());

    return {
      success: true,
      userId: user._id,
      email: user.email,
      tempPassword: authResult.tempPassword,
    };
  }

  // ─── Events ───────────────────────────────────────────────────────────────

  async getEvents(params?: { page?: number; limit?: number }) {
    try {
      const { data } = await this.client.get('/events', {
        params: { page: params?.page || 1, limit: params?.limit || 20 },
      });
      return {
        data: data.data || data.events || [],
        meta: {
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 20,
          totalPages: data.totalPages || 0,
        },
      };
    } catch (err) {
      this.logger.error(`CMS getEvents failed: ${err.message}`);
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }
  }

  /** Get events for a specific user by email (if CMS supports filter) */
  async getEventsForUser(email: string) {
    try {
      const { data } = await this.client.get('/events', {
        params: { attendeeEmail: email, limit: 50 },
      });
      return data.events || data.data || [];
    } catch (err) {
      this.logger.warn(`CMS getEventsForUser(${email}) failed: ${err.message}`);
      return [];
    }
  }

  // ─── Dynamic Content / Banners ────────────────────────────────────────────

  async getBanners() {
    try {
      const { data } = await this.client.get('/carousel');
      return data;
    } catch (err) {
      this.logger.warn(`CMS getBanners failed: ${err.message}`);
      return [];
    }
  }

  async getResources(params?: { page?: number; limit?: number }) {
    try {
      const { data } = await this.client.get('/downloadable-resources-public', {
        params: { page: params?.page || 1, limit: params?.limit || 20 },
      });
      return {
        data: data.data || [],
        meta: {
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 20,
          totalPages: data.totalPages || 0,
        },
      };
    } catch (err) {
      this.logger.warn(`CMS getResources failed: ${err.message}`);
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }
  }

  async getBlogPosts(params?: { page?: number; limit?: number }) {
    try {
      const { data } = await this.client.get('/blog', { params });
      return {
        data: data.data || [],
        meta: {
          total: data.total || 0,
          page: data.page || 1,
          limit: params?.limit || 10,
          totalPages: data.totalPages || 0,
        },
      };
    } catch (err) {
      this.logger.warn(`CMS getBlogPosts failed: ${err.message}`);
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
  }
}
