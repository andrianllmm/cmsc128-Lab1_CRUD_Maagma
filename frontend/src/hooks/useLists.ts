import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AddMemberInput, CreateListInput } from "@/schemas/lists";
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

  const addMemberMutation = useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: AddMemberInput }) =>
      listsApi.addMember(listId, data),
    // Swaps in the updated list so the new member shows right away
    onSuccess: (updated, { data }) => {
      queryClient.setQueryData(listsQueryOptions.queryKey, (lists) =>
        lists?.map((l) => (l._id === updated._id ? updated : l)),
      );
      toast.success(`Added ${data.email}`);
    },
    onError: (err) => toast.error(err.message || "Failed to add member"),
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

  /**
   * Adds a user to a list by email. Only the list owner can.
   * Returns `false` on failure (e.g. no user with that email).
   * */
  async function addMember(
    listId: string,
    data: AddMemberInput,
  ): Promise<boolean> {
    try {
      await addMemberMutation.mutateAsync({ listId, data });
      return true;
    } catch {
      return false;
    }
  }

  return { lists, createList, addMember };
}
