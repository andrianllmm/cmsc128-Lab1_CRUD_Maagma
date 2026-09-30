import { mongo } from "mongoose";
import { UserModel, type UserDocument } from "./users.model.js";

const DUPLICATE_KEY_ERROR = 11000;

interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
}

const findByEmail = async (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email });
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
  findByEmail,
  createUser,
};
