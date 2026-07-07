

export function formatMonth(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatDate(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
