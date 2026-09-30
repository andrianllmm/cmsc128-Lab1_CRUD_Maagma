import { Schema, model, type InferSchemaType } from "mongoose";
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
  },
  {
    timestamps: true,
    toJSON: {
      // Never send the hash in responses, even if it was selected
      transform: (_doc, ret) => {
        const { passwordHash: _passwordHash, ...user } = ret;
        return user;
      },
    },
  },
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
