import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { DISPLAY_NAME_MAX_LENGTH } from "./users.constants.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: DISPLAY_NAME_MAX_LENGTH,
    },
    passwordHash: {
      type: String,
      required: true,
      // Excluded from queries
      select: false,
    },
    resetTokenHash: {
      type: String,
      select: false,
    },
    resetTokenExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Never send the hashes in responses, even if they were selected
      transform: (_doc, ret: Record<string, unknown>) => {
        const {
          passwordHash: _passwordHash,
          resetTokenHash: _resetTokenHash,
          resetTokenExpiresAt: _resetTokenExpiresAt,
          ...user
        } = ret;
        return user;
      },
    },
  },
);

export type User = InferSchemaType<typeof userSchema>;
// A saved user, with `_id` and document methods
export type UserDocument = HydratedDocument<User>;
export const UserModel = model("User", userSchema);
