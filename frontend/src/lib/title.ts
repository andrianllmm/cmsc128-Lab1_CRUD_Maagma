const APP_NAME = "TODO";

/**
 * A route's `head`, so the browser tab says which page is open.
 * */
export const pageHead = (page: string) => () => ({
  meta: [{ title: `${page} · ${APP_NAME}` }],
});
