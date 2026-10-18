import { apiFetch } from "@/lib/api";
import type { CreateListInput } from "@/schemas/lists";
import type { List } from "@/types/lists";

export const getLists = () => apiFetch<List[]>("lists");

export const createList = (data: CreateListInput) =>
  apiFetch<List>("lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
