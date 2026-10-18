import { ListModel, type ListDocument } from "./lists.model.js";
import { PERSONAL_LIST_NAME } from "./lists.constants.js";

// Lists a user can access: ones they own or were added to
const accessibleBy = (userId: string) => ({
  $or: [{ owner: userId }, { members: userId }],
});

const getLists = async (userId: string): Promise<ListDocument[]> => {
  // Personal list first, then oldest first
  return ListModel.find(accessibleBy(userId)).sort({
    personal: -1,
    createdAt: 1,
  });
};

/**
 * Finds a list the user can access.
 * Returns `null` if it doesn't exist or the user isn't its owner or a member.
 * */
const getListById = async (
  userId: string,
  id: string,
): Promise<ListDocument | null> => {
  return ListModel.findOne({ _id: id, ...accessibleBy(userId) });
};

const createList = async (
  userId: string,
  name: string,
): Promise<ListDocument> => {
  return ListModel.create({ name, owner: userId });
};

const createPersonalList = async (userId: string): Promise<ListDocument> => {
  return ListModel.create({
    name: PERSONAL_LIST_NAME,
    owner: userId,
    personal: true,
  });
};

export const listService = {
  getLists,
  getListById,
  createList,
  createPersonalList,
};
