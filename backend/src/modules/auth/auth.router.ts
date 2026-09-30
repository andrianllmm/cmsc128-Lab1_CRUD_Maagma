import { Router } from "express";

import { authController } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

export const authRouter: Router = Router();

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Create an account and log in
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, displayName, password]
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              displayName:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      201:
 *        description: Created user; sets the session cookie
 *      400:
 *        description: Invalid registration data
 *      409:
 *        description: Email already in use
 */
authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Log in
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, password]
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Logged-in user; sets the session cookie
 *      400:
 *        description: Invalid login data
 *      401:
 *        description: Invalid credentials
 */
authRouter.post("/login", validateBody(loginSchema), authController.login);

/**
 * @openapi
 * /auth/logout:
 *  post:
 *    summary: Log out
 *    tags: [Auth]
 *    responses:
 *      204:
 *        description: Session destroyed; clears the session cookie
 */
authRouter.post("/logout", authController.logout);

/**
 * @openapi
 * /auth/me:
 *  get:
 *    summary: Get the logged-in user
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: Logged-in user
 *      401:
 *        description: Not logged in
 */
authRouter.get("/me", requireAuth, authController.me);

/**
 * @openapi
 * /auth/forgot-password:
 *  post:
 *    summary: Request a password reset link
 *    description: Responds the same whether or not the email exists. The link is printed in the server terminal.
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email]
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *    responses:
 *      200:
 *        description: Reset link sent if the account exists
 *      400:
 *        description: Invalid email
 */
authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @openapi
 * /auth/reset-password:
 *  post:
 *    summary: Set a new password using a reset token
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [token, newPassword]
 *            properties:
 *              token:
 *                type: string
 *              newPassword:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Password reset
 *      400:
 *        description: Invalid data, or the reset token is invalid or expired
 */
authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);
