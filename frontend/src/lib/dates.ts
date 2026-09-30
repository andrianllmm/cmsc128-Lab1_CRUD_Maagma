import { endOfDay, formatRelative, isEqual } from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * Due dates without a time are stored as the end of their day.
 * */
export function hasTime(date: Date) {
  return !isEqual(date, endOfDay(date));
}

// Same as the default relative format but without the "at <time>" part
const DATE_ONLY_FORMATS = {
  lastWeek: "'last' eeee",
  yesterday: "'yesterday'",
  today: "'today'",
  tomorrow: "'tomorrow'",
  nextWeek: "eeee",
  other: "P",
};

const dateOnlyLocale = {
  ...enUS,
  formatRelative: (token: keyof typeof DATE_ONLY_FORMATS) =>
    DATE_ONLY_FORMATS[token],
};

/**
 * Formats a due date relative to now, showing the time only if one was set.
 * */
export function formatDueDate(date: Date) {
  return hasTime(date)
    ? formatRelative(date, new Date())
    : formatRelative(date, new Date(), { locale: dateOnlyLocale });
}
