import { UserDocument } from '../schemas/user.schema';

/** Fields considered for profile completion and their weights */
const PROFILE_FIELDS: Array<{ key: string; weight: number }> = [
  { key: 'firstName', weight: 10 },
  { key: 'lastName', weight: 10 },
  { key: 'email', weight: 10 },
  { key: 'phone', weight: 10 },
  { key: 'institution', weight: 15 },
  { key: 'designation', weight: 15 },
  { key: 'profilePhoto', weight: 15 },
  { key: 'address', weight: 15 },
];

export function calculateProfileCompletion(user: Partial<UserDocument>): number {
  let score = 0;
  const totalWeight = PROFILE_FIELDS.reduce((sum, f) => sum + f.weight, 0);

  for (const field of PROFILE_FIELDS) {
    const value = (user as any)[field.key];
    if (field.key === 'address') {
      // Address counts if at least city + country are filled
      if (value && value.city && value.country) score += field.weight;
    } else if (value && String(value).trim() !== '') {
      score += field.weight;
    }
  }

  return Math.round((score / totalWeight) * 100);
}
