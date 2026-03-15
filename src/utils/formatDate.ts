import { Timestamp } from "firebase/firestore";

type FirestoreDate = Date | Timestamp | undefined | null;

export const formatDate = (
  start: FirestoreDate,
  end?: FirestoreDate,
  locale = "en-US",
): string => {
  if (!start) return "";

  // Convert Timestamp → Date
  const toDate = (d: FirestoreDate): Date | null => {
    if (!d) return null;
    return d instanceof Timestamp ? d.toDate() : new Date(d);
  };

  const s = toDate(start);
  const e = toDate(end);

  if (!s || isNaN(s.getTime())) return "";

  const month = s.toLocaleString(locale, { month: "long" });
  const startDay = s.getDate();
  const year = s.getFullYear();

  // 👉 Single date
  if (!e || isNaN(e.getTime())) {
    return `${month} ${startDay}, ${year}`;
  }

  // 👉 Same month & year range
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    return `${month} ${startDay} – ${e.getDate()}, ${year}`;
  }

  // 👉 Different month/year range
  const endStr = e.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${month} ${startDay}, ${year} – ${endStr}`;
};
