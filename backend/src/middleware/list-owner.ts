import type { Request, Response, NextFunction } from "express";
import type { ListAccess } from "../modules/lists/lists.model.js";

// Each owner-only action, as it reads in "Personal lists can't be ..."
const PAST_TENSE = {
  share: "shared",
  rename: "renamed",
  delete: "deleted",
} as const;

type ListAction = keyof typeof PAST_TENSE;

/**
 * Rejects owner-only actions from members, and any change to a personal list.
 * Runs after `requireListAccess`, which sets `res.locals.list`.
 * */
export const requireListOwner =
  (action: ListAction) => (req: Request, res: Response, next: NextFunction) => {
    const list: ListAccess = res.locals.list;

    // Members can see the list but only the owner can change it
    if (!list.owner.equals(req.session.userId!)) {
      return res
        .status(403)
        .json({ message: `Only the list owner can ${action} it` });
    }

    if (list.personal) {
      return res
        .status(400)
        .json({ message: `Personal lists can't be ${PAST_TENSE[action]}` });
    }

    next();
  };
