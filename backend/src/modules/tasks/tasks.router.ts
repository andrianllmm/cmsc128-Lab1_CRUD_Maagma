import { Router } from "express";

import { taskController } from "./tasks.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireListAccess } from "../../middleware/list-access.js";
import { validateBody, validateParams } from "../../middleware/validate.js";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "./tasks.schema.js";
import { listIdSchema } from "../lists/lists.schema.js";

// Mounted under /lists/:listId/tasks; `mergeParams` exposes `listId`
export const taskRouter: Router = Router({ mergeParams: true });

// Every task route first checks the user can access the list
taskRouter.use(requireAuth, validateParams(listIdSchema), requireListAccess);

/**
 * @openapi
 * /lists/{listId}/tasks:
 *  get:
 *    summary: Get all tasks
 *    tags: [Tasks]
 *    parameters:
 *      - name: listId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of tasks
 *      401:
 *        description: Not logged in
 *      404:
 *        description: List not found
 */
taskRouter.get("/", taskController.getTasks);

/**
 * @openapi
 * /lists/{listId}/tasks/{id}:
 *  get:
 *    summary: Get task by ID
 *    tags: [Tasks]
 *    parameters:
 *      - name: listId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A task
 *      400:
 *        description: Invalid list or task id
 *      401:
 *        description: Not logged in
 *      404:
 *        description: List or task not found
 */
taskRouter.get(
  "/:id",
  validateParams(taskIdSchema),
  taskController.getTaskById,
);

/**
 * @openapi
 * /lists/{listId}/tasks:
 *  post:
 *    summary: Create task
 *    tags: [Tasks]
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
 *            required: [title]
 *            properties:
 *              title:
 *                type: string
 *              dueDate:
 *                type: string
 *                format: date-time
 *              priority:
 *                type: string
 *                enum: [Low, Medium, High, None]
 *              tag:
 *                type: string
 *                enum: [Work, School, Personal, Others]
 *    responses:
 *      201:
 *        description: Created task
 *      400:
 *        description: Invalid list id or task data
 *      401:
 *        description: Not logged in
 *      404:
 *        description: List not found
 */
taskRouter.post("/", validateBody(createTaskSchema), taskController.createTask);

/**
 * @openapi
 * /lists/{listId}/tasks/{id}:
 *  patch:
 *    summary: Update task
 *    tags: [Tasks]
 *    parameters:
 *      - name: listId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: id
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
 *            properties:
 *              title:
 *                type: string
 *              dueDate:
 *                type: string
 *                format: date-time
 *              priority:
 *                type: string
 *                enum: [Low, Medium, High, None]
 *              tag:
 *                type: string
 *                enum: [Work, School, Personal, Others]
 *              done:
 *                type: boolean
 *    responses:
 *      200:
 *        description: Updated task
 *      400:
 *        description: Invalid list id, task id, or data
 *      401:
 *        description: Not logged in
 *      404:
 *        description: List or task not found
 */
taskRouter.patch(
  "/:id",
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask,
);

/**
 * @openapi
 * /lists/{listId}/tasks/{id}:
 *  delete:
 *    summary: Delete task
 *    tags: [Tasks]
 *    parameters:
 *      - name: listId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Deleted task
 *      400:
 *        description: Invalid list or task id
 *      401:
 *        description: Not logged in
 *      404:
 *        description: List or task not found
 */
taskRouter.delete(
  "/:id",
  validateParams(taskIdSchema),
  taskController.deleteTask,
);
