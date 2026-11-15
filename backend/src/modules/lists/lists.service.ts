import type { Types } from "mongoose";
import {
  ListModel,
  type ListAccess,
  type ListDocument,
} from "./lists.model.js";
import { TaskModel } from "../tasks/tasks.model.js";
import { PERSONAL_LIST_NAME } from "./lists.constants.js";

// Only the user fields needed to show who's in a list; never the password hash
const USER_FIELDS = "displayName email";
const withUsers = [
  { path: "owner", select: USER_FIELDS },
  { path: "members", select: USER_FIELDS },
];

// Reads use `.lean()`: responses only need plain JSON, not full Mongoose documents

// Lists a user can access: ones they own or were added to
const accessibleBy = (userId: string) => ({
  $or: [{ owner: userId }, { members: userId }],
});

const getLists = async (userId: string) => {
  // Personal list first, then oldest first
  return ListModel.find(accessibleBy(userId))
    .sort({ personal: -1, createdAt: 1 })
    .populate(withUsers)
    .lean();
};

/**
 * Finds a list the user can access, with only the fields access checks need.
 * Returns `null` if it doesn't exist or the user isn't its owner or a member.
 * */
const getListById = async (
  userId: string,
  id: string,
): Promise<ListAccess | null> => {
  return ListModel.findOne({ _id: id, ...accessibleBy(userId) })
    .select("owner members personal")
    .lean();
};

const createList = async (
  userId: string,
  name: string,
): Promise<ListDocument> => {
  const list = await ListModel.create({ name, owner: userId });
  return list.populate(withUsers);
};

const createPersonalList = async (userId: string): Promise<ListDocument> => {
  return ListModel.create({
    name: PERSONAL_LIST_NAME,
    owner: userId,
    personal: true,
  });
};

const addMember = async (listId: Types.ObjectId, memberId: Types.ObjectId) => {
  return ListModel.findByIdAndUpdate(
    listId,
    { $addToSet: { members: memberId } },
    { returnDocument: "after" },
  )
    .populate(withUsers)
    .lean();
};

const renameList = async (listId: Types.ObjectId, name: string) => {
  return ListModel.findByIdAndUpdate(
    listId,
    { name },
    { returnDocument: "after", runValidators: true },
  )
    .populate(withUsers)
    .lean();
};

// Deletes the list along with its tasks
const deleteList = async (listId: Types.ObjectId): Promise<void> => {
  await TaskModel.deleteMany({ list: listId });
  await ListModel.findByIdAndDelete(listId);
};

export const listService = {
  getLists,
  getListById,
  createList,
  createPersonalList,
  addMember,
  renameList,
  deleteList,
};
