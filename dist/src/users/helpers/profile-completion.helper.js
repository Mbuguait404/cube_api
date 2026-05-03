"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProfileCompletion = calculateProfileCompletion;
const PROFILE_FIELDS = [
    { key: 'firstName', weight: 10 },
    { key: 'lastName', weight: 10 },
    { key: 'email', weight: 10 },
    { key: 'phone', weight: 10 },
    { key: 'institution', weight: 15 },
    { key: 'designation', weight: 15 },
    { key: 'profilePhoto', weight: 15 },
    { key: 'address', weight: 15 },
];
function calculateProfileCompletion(user) {
    let score = 0;
    const totalWeight = PROFILE_FIELDS.reduce((sum, f) => sum + f.weight, 0);
    for (const field of PROFILE_FIELDS) {
        const value = user[field.key];
        if (field.key === 'address') {
            if (value && value.city && value.country)
                score += field.weight;
        }
        else if (value && String(value).trim() !== '') {
            score += field.weight;
        }
    }
    return Math.round((score / totalWeight) * 100);
}
//# sourceMappingURL=profile-completion.helper.js.map