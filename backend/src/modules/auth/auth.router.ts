import { Router } from "express";

import { authController } from "./auth.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

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
