import type { Request, Response } from "express";

import { listService } from "./lists.service.js";
import { userService } from "../users/users.service.js";
import type { ListDocument } from "./lists.model.js";
import type {
  AddMemberInput,
  CreateListInput,
  ListIdInput,
} from "./lists.schema.js";

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

const addMember = async (
  req: Request<ListIdInput, unknown, AddMemberInput>,
  res: Response,
) => {
  // Set by `requireListAccess`, checked by `requireListOwner`
  const list: ListDocument = res.locals.list;

  const member = await userService.findByEmail(req.body.email);
  if (!member) {
    return res.status(404).json({ message: "No user with that email" });
  }

  const alreadyIn =
    list.owner.equals(member._id) ||
    list.members.some((id) => id.equals(member._id));
  if (alreadyIn) {
    return res.status(409).json({ message: "Already in this list" });
  }

  const updated = await listService.addMember(list.id, member.id);
  res.json(updated);
};

const renameList = async (
  req: Request<ListIdInput, unknown, CreateListInput>,
  res: Response,
) => {
  // Set by `requireListAccess`, checked by `requireListOwner`
  const list: ListDocument = res.locals.list;

  const updated = await listService.renameList(list.id, req.body.name);
  res.json(updated);
};

const deleteList = async (req: Request<ListIdInput>, res: Response) => {
  // Set by `requireListAccess`, checked by `requireListOwner`
  const list: ListDocument = res.locals.list;

  await listService.deleteList(list.id);
  res.status(204).end();
};

export const listController = {
  getLists,
  createList,
  addMember,
  renameList,
  deleteList,
};
