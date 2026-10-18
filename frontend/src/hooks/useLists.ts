import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateListInput } from "@/schemas/lists";
import type { List } from "@/types/lists";
import * as listsApi from "@/api/lists";

// Lists the user owns or was added to, personal list first
export const listsQueryOptions = queryOptions({
  queryKey: ["lists"],
  queryFn: listsApi.getLists,
});

/**
 * Lists of the logged-in user.
 * Expects the route's loader to have fetched them already.
 * */
export function useLists() {
  const queryClient = useQueryClient();

  const { data: lists } = useSuspenseQuery(listsQueryOptions);

  const createMutation = useMutation({
    mutationFn: listsApi.createList,
    // Added right away so the new list can be selected without a refetch
    onSuccess: (list) =>
      queryClient.setQueryData(listsQueryOptions.queryKey, (lists) =>
        lists ? [...lists, list] : [list],
      ),
    onError: (err) => toast.error(err.message || "Failed to create list"),
  });

  /**
   * Creates a collaborative list.
   * Returns the new list, or `null` on failure.
   * */
  async function createList(data: CreateListInput): Promise<List | null> {
    try {
      return await createMutation.mutateAsync(data);
    } catch {
      return null;
    }
  }

  return { lists, createList };
}
