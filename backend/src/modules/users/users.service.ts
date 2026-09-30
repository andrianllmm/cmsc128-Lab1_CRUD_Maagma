import { mongo } from "mongoose";
import { UserModel, type UserDocument } from "./users.model.js";

const DUPLICATE_KEY_ERROR = 11000;

// Unique index violation (e.g. email already taken)
const isDuplicateKeyError = (err: unknown) =>
  err instanceof mongo.MongoServerError && err.code === DUPLICATE_KEY_ERROR;

interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
}

const UPDATE_OPTIONS = {
  returnDocument: "after",
  runValidators: true,
} as const;

const findById = async (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};

const findByIdWithPassword = async (id: string) => {
  return UserModel.findById(id).select("+passwordHash");
};

const findByEmail = async (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email });
};

const findByEmailWithPassword = async (email: string) => {
  return UserModel.findOne({ email }).select("+passwordHash");
};

/**
 * Creates a user.
 * Returns `null` if the email is already taken.
 * */
const createUser = async (
  data: CreateUserData,
): Promise<UserDocument | null> => {
  try {
    return await UserModel.create(data);
  } catch (err) {
    // Unique index catches concurrent signups that passed `findByEmail`
    if (isDuplicateKeyError(err)) return null;
    throw err;
  }
};

/**
 * Returns `null` if the user doesn't exist.
 * */
const updateDisplayName = async (
  id: string,
  displayName: string,
): Promise<UserDocument | null> => {
  return UserModel.findByIdAndUpdate(id, { displayName }, UPDATE_OPTIONS);
};

/**
 * Returns `null` if the email is already taken.
 * */
const updateEmail = async (
  id: string,
  email: string,
): Promise<UserDocument | null> => {
  try {
    return await UserModel.findByIdAndUpdate(id, { email }, UPDATE_OPTIONS);
  } catch (err) {
    if (isDuplicateKeyError(err)) return null;
    throw err;
  }
};

const updatePasswordHash = async (
  id: string,
  passwordHash: string,
): Promise<void> => {
  await UserModel.findByIdAndUpdate(id, { passwordHash });
};

export const userService = {
  findById,
  findByIdWithPassword,
  findByEmail,
  findByEmailWithPassword,
  createUser,
  updateDisplayName,
  updateEmail,
  updatePasswordHash,
};
