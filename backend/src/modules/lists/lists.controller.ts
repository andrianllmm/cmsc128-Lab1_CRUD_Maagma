import type { Request, Response } from "express";

import { listService } from "./lists.service.js";
import type { CreateListInput } from "./lists.schema.js";

const getLists = async (req: Request, res: Response) => {
  const lists = await listService.getLists(req.session.userId!);
  res.json(lists);
};

const createList = async (
  req: Request<unknown, unknown, CreateListInput>,
  res: Response,
) => {
  const list = await listService.createList(req.session.userId!, req.body.name);
  res.status(201).json(list);
};

export const listController = {
  getLists,
  createList,
};
