export const DISPLAY_NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
// Argon2 accepts longer, but long inputs slow hashing down
export const PASSWORD_MAX_LENGTH = 128;
export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
