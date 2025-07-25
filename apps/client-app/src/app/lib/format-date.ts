import type { DateValue } from "@heroui/react";
import {
  fromDate,
  getLocalTimeZone,
  DateFormatter,
  toCalendarDate,
} from "@internationalized/date";

export function formatDate(input: Date | string) {
  const dateObj = typeof input === "string" ? new Date(input) : input;

  if (isNaN(dateObj.getTime())) return "";

  const zonedDateTime = fromDate(dateObj, getLocalTimeZone());
  const nativeDate = zonedDateTime.toDate();

  const formatter = new DateFormatter("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formatter.format(nativeDate);
}

export function convertToCalendarDate(date: Date): DateValue {
  return toCalendarDate(fromDate(date, getLocalTimeZone())) as unknown as DateValue;
}
