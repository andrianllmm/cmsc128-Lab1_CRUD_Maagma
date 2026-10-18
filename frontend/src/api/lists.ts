import { apiFetch } from "@/lib/api";
import type { AddMemberInput, CreateListInput } from "@/schemas/lists";
import type { List } from "@/types/lists";

export const getLists = () => apiFetch<List[]>("lists");

export const createList = (data: CreateListInput) =>
  apiFetch<List>("lists", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addMember = (listId: string, data: AddMemberInput) =>
  apiFetch<List>(`lists/${listId}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const renameList = (listId: string, data: CreateListInput) =>
  apiFetch<List>(`lists/${listId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteList = (listId: string) =>
  apiFetch<void>(`lists/${listId}`, { method: "DELETE" });
