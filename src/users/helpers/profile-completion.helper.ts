import { UserDocument } from '../schemas/user.schema';

/** Fields considered for profile completion and their weights */
const PROFILE_FIELDS: Array<{ key: string; weight: number }> = [
  { key: 'firstName', weight: 5 },
  { key: 'lastName', weight: 5 },
  { key: 'email', weight: 5 },
  { key: 'phone', weight: 5 },
  { key: 'institution', weight: 5 },
  { key: 'designation', weight: 5 },
  { key: 'profilePhoto', weight: 10 },
  { key: 'address', weight: 5 },
];

const EXTENDED_FIELDS: Array<{ key: string; weight: number }> = [
  { key: 'bio', weight: 5 },
  { key: 'currentRole', weight: 3 },
  { key: 'yearsOfExperience', weight: 2 },
  { key: 'openTo', weight: 3 },
  { key: 'primarySkillAreas', weight: 5 },
  { key: 'techStack', weight: 5 },
  { key: 'highestQualification', weight: 3 },
  { key: 'fieldOfStudy', weight: 2 },
  { key: 'institutionName', weight: 2 },
  { key: 'workHistory', weight: 5 },
  { key: 'areasOfInterest', weight: 3 },
  { key: 'lookingForFromHub', weight: 3 },
  { key: 'shortTermGoal', weight: 3 },
  { key: 'longTermGoal', weight: 3 },
  { key: 'linkedinUrl', weight: 3 },
  { key: 'profileVisibility', weight: 2 },
];

function isNonEmpty(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

export function calculateProfileCompletion(user: Partial<UserDocument>): number {
  let score = 0;
  const totalWeight =
    PROFILE_FIELDS.reduce((s, f) => s + f.weight, 0) +
    EXTENDED_FIELDS.reduce((s, f) => s + f.weight, 0);

  // Section 1
  for (const field of PROFILE_FIELDS) {
    const value = (user as any)[field.key];
    if (field.key === 'address') {
      if (value && value.city && value.country) score += field.weight;
    } else if (isNonEmpty(value)) {
      score += field.weight;
    }
  }

  // Section 2 (extended profile)
  const ep = (user as any).extendedProfile || {};
  for (const field of EXTENDED_FIELDS) {
    if (isNonEmpty(ep[field.key])) score += field.weight;
  }

  return Math.round((score / totalWeight) * 100);
}
