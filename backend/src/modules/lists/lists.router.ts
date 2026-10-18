import { Router } from "express";

import { listController } from "./lists.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireListAccess } from "../../middleware/list-access.js";
import { validateBody, validateParams } from "../../middleware/validate.js";
import {
  addMemberSchema,
  createListSchema,
  listIdSchema,
} from "./lists.schema.js";

export const listRouter: Router = Router();

listRouter.use(requireAuth);

/**
 * @openapi
 * /lists:
 *  get:
 *    summary: Get the lists the logged-in user owns or was added to
 *    tags: [Lists]
 *    responses:
 *      200:
 *        description: List of lists, personal list first
 *      401:
 *        description: Not logged in
 */
listRouter.get("/", listController.getLists);

/**
 * @openapi
 * /lists:
 *  post:
 *    summary: Create a collaborative list
 *    tags: [Lists]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [name]
 *            properties:
 *              name:
 *                type: string
 *    responses:
 *      201:
 *        description: Created list
 *      400:
 *        description: Invalid list data
 *      401:
 *        description: Not logged in
 */
listRouter.post("/", validateBody(createListSchema), listController.createList);

/**
 * @openapi
 * /lists/{listId}/members:
 *  post:
 *    summary: Add a user to a list by email (list owner only)
 *    tags: [Lists]
 *    parameters:
 *      - name: listId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
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
 *    responses:
 *      200:
 *        description: Updated list
 *      400:
 *        description: Invalid list id or email, or the list is personal
 *      401:
 *        description: Not logged in
 *      403:
 *        description: Not the list owner
 *      404:
 *        description: List or user not found
 *      409:
 *        description: User is already in the list
 */
listRouter.post(
  "/:listId/members",
  validateParams(listIdSchema),
  requireListAccess,
  validateBody(addMemberSchema),
  listController.addMember,
);
