import { Router } from "express";

import { listController } from "./lists.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { createListSchema } from "./lists.schema.js";

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
