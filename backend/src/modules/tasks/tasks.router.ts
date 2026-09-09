import { Router } from "express";

import { taskController } from "./tasks.controller.js";
import { validateBody, validateParams } from "../../middleware/validate.js";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "./tasks.schema.js";

export const taskRouter: Router = Router();

/**
 * @openapi
 * /tasks:
 *  get:
 *    summary: Get all tasks
 *    tags: [Tasks]
 *    responses:
 *      200:
 *        description: List of tasks
 */
taskRouter.get("/", taskController.getTasks);

/**
 * @openapi
 * /tasks/{id}:
 *  get:
 *    summary: Get task by ID
 *    tags: [Tasks]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A task
 *      400:
 *        description: Invalid task id
 *      404:
 *        description: Task not found
 */
taskRouter.get(
  "/:id",
  validateParams(taskIdSchema),
  taskController.getTaskById,
);

/**
 * @openapi
 * /tasks:
 *  post:
 *    summary: Create task
 *    tags: [Tasks]
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
 *        description: Invalid task data
 */
taskRouter.post("/", validateBody(createTaskSchema), taskController.createTask);

/**
 * @openapi
 * /tasks/{id}:
 *  patch:
 *    summary: Update task
 *    tags: [Tasks]
 *    parameters:
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
 *        description: Invalid task id or data
 *      404:
 *        description: Task not found
 */
taskRouter.patch(
  "/:id",
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask,
);

/**
 * @openapi
 * /tasks/{id}:
 *  delete:
 *    summary: Delete task
 *    tags: [Tasks]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Deleted task
 *      400:
 *        description: Invalid task id
 *      404:
 *        description: Task not found
 */
taskRouter.delete(
  "/:id",
  validateParams(taskIdSchema),
  taskController.deleteTask,
);
