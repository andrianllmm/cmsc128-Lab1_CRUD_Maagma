import type { Request, Response, NextFunction } from "express";
import { listService } from "../modules/lists/lists.service.js";
import type { ListIdInput } from "../modules/lists/lists.schema.js";

/**
 * Rejects requests for a list the logged-in user doesn't own or belong to.
 * Responds with 404 so other users' lists aren't revealed.
 * */
export const requireListAccess = async (
  req: Request<ListIdInput>,
  res: Response,
  next: NextFunction,
) => {
  const list = await listService.getListById(
    req.session.userId!,
    req.params.listId,
  );
  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }
  next();
};
