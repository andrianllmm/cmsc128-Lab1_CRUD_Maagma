import { Router } from "express";

import { userController } from "./users.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import {
  updateEmailSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "./users.schema.js";

export const userRouter: Router = Router();

userRouter.use(requireAuth);

/**
 * @openapi
 * /users/me:
 *  patch:
 *    summary: Update the logged-in user's profile
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [displayName]
 *            properties:
 *              displayName:
 *                type: string
 *    responses:
 *      200:
 *        description: Updated user
 *      400:
 *        description: Invalid profile data
 *      401:
 *        description: Not logged in
 */
userRouter.patch(
  "/me",
  validateBody(updateProfileSchema),
  userController.updateProfile,
);

/**
 * @openapi
 * /users/me/email:
 *  patch:
 *    summary: Change the logged-in user's email
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, currentPassword]
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              currentPassword:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Updated user
 *      400:
 *        description: Invalid email or incorrect current password
 *      401:
 *        description: Not logged in
 *      409:
 *        description: Email already in use
 */
userRouter.patch(
  "/me/email",
  validateBody(updateEmailSchema),
  userController.updateEmail,
);

/**
 * @openapi
 * /users/me/password:
 *  patch:
 *    summary: Change the logged-in user's password
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [currentPassword, newPassword]
 *            properties:
 *              currentPassword:
 *                type: string
 *                format: password
 *              newPassword:
 *                type: string
 *                format: password
 *    responses:
 *      204:
 *        description: Password changed
 *      400:
 *        description: Invalid new password or incorrect current password
 *      401:
 *        description: Not logged in
 */
userRouter.patch(
  "/me/password",
  validateBody(updatePasswordSchema),
  userController.updatePassword,
);
