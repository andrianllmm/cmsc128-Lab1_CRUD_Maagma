import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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
  const { data: lists } = useSuspenseQuery(listsQueryOptions);
  return { lists };
}
