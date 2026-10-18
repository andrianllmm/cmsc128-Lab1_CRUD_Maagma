import argon2 from "argon2";

/**
 * Hashes a password.
 * The salt and parameters are embedded in the returned hash string.
 * */
export const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, { type: argon2.argon2id });
};

/**
 * Checks a password against a stored hash.
 * */
export const verifyPassword = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return argon2.verify(hash, password);
};
