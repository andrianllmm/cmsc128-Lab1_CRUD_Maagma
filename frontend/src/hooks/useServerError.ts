import { useState } from "react";
import { ApiError } from "@/lib/api";

/**
 * Keeps the error from a form's last submit, so it can be shown in the form
 * instead of a toast that's easy to miss.
 * Errors the API ties to one of `fields` show under that field; anything else
 * (e.g. "Invalid credentials") shows above the form.
 * */
export function useServerError(fields: readonly string[]) {
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Runs a submit, clearing the previous error first.
   * Returns `false` if it failed.
   * */
  async function run(submit: () => Promise<unknown>): Promise<boolean> {
    setError(null);
    try {
      await submit();
      return true;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err
          : new ApiError(0, "Something went wrong. Try again."),
      );
      return false;
    }
  }

  const fieldError = (name: string): string | undefined =>
    error?.fieldErrors[name]?.[0];

  const shownOnField = fields.some((name) => fieldError(name));
  const formError = error && !shownOnField ? error.message : null;

  return { run, fieldError, formError };
}
