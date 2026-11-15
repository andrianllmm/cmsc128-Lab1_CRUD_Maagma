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
  // Set by `requireListAccess`
  const list: ListDocument = res.locals.list;

  // Members can see the list but only the owner can share it
  if (!list.owner.equals(req.session.userId!)) {
    return res
      .status(403)
      .json({ message: "Only the list owner can add members" });
  }

  if (list.personal) {
    return res.status(400).json({ message: "Personal lists can't be shared" });
  }

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
  // Set by `requireListAccess`
  const list: ListDocument = res.locals.list;

  if (!list.owner.equals(req.session.userId!)) {
    return res
      .status(403)
      .json({ message: "Only the list owner can rename it" });
  }

  if (list.personal) {
    return res.status(400).json({ message: "Personal lists can't be renamed" });
  }

  const updated = await listService.renameList(list.id, req.body.name);
  res.json(updated);
};

const deleteList = async (req: Request<ListIdInput>, res: Response) => {
  // Set by `requireListAccess`
  const list: ListDocument = res.locals.list;

  if (!list.owner.equals(req.session.userId!)) {
    return res
      .status(403)
      .json({ message: "Only the list owner can delete it" });
  }

  if (list.personal) {
    return res.status(400).json({ message: "Personal lists can't be deleted" });
  }

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
