import { apiFetch } from "@/lib/api";
import type { List } from "@/types/lists";

export const getLists = () => apiFetch<List[]>("lists");
