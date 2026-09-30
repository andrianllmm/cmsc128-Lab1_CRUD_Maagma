import { mongo } from "mongoose";
import { UserModel, type UserDocument } from "./users.model.js";

const DUPLICATE_KEY_ERROR = 11000;

interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
}

const findById = async (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id);
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
    if (
      err instanceof mongo.MongoServerError &&
      err.code === DUPLICATE_KEY_ERROR
    ) {
      return null;
    }
    throw err;
  }
};

export const userService = {
  findById,
  findByEmail,
  findByEmailWithPassword,
  createUser,
};
