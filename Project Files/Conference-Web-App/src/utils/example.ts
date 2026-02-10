// This is an example of a utility function that can be used in the Conference Web App.
// You can replace this with any utility function you need for your application.
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}
