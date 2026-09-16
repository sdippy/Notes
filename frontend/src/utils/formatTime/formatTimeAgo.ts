import {
  formatRelative,
  formatDistanceToNowStrict,
  isValid,
  differenceInCalendarDays,
} from "date-fns";
import { ru } from "date-fns/locale";

export function formatMiddleTimeAgoRu(date: string) {
  const parsedDate = new Date(date);
  const now = new Date();

  if (!isValid(parsedDate)) {
    return "Некорректная дата";
  }

  const dayDiff = differenceInCalendarDays(now, parsedDate);

  if (dayDiff === 0 || dayDiff === 1) {
    return formatRelative(parsedDate, now, { locale: ru });
  }

  const result = formatDistanceToNowStrict(parsedDate, { locale: ru });

  const shortResult = result
    .replace(/минут[ауы]?/, "мин.")
    .replace(/час(а|ов)?/, "ч.")
    .replace(/д(ень|ня|ней)/, "дн.")
    .replace(/месяц(а|ев)?/, "мес.")
    .replace(/(год|года|лет)/, "г.");

  return `${shortResult} назад`;
}
