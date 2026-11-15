export const DISPLAY_NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const RESET_LINK_TTL_MINUTES = 30;

export interface User {
  _id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}
