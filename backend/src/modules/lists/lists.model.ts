import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { LIST_NAME_MAX_LENGTH } from "./lists.constants.js";

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: LIST_NAME_MAX_LENGTH,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Users the owner shared the list with
    members: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
      index: true,
    },
    // Each user's own list, created on registration and never shared
    personal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export type List = InferSchemaType<typeof listSchema>;
export type ListDocument = HydratedDocument<List>;
export const ListModel = model("List", listSchema);
