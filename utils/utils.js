export const truncateString = (str, limit = 29) => {
  if (str.length > limit) {
    // Truncate to the limit and add three dots
    return `${str.substring(0, limit - 3)} ...`;
  }
  return str;
};

export const formatDate = (date) => {
  // Convert to Date object if `date` is a string
  if (typeof date === "string") {
    date = new Date(date);
  }

  // Check if date is valid
  if (date instanceof Date && !isNaN(date)) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  } else {
    return "Invalid Date"; // Optional: handle invalid dates
  }
};

//formatDate   fromat = "Feb 10th"
export function formatDate2(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Extract the day and add the ordinal suffix
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  // Combine the month and day with suffix
  return formattedDate.replace(day, `${day}${ordinalSuffix}`);
}

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th"; // Special case for 11, 12, 13
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export const isDueDatePassed = (dueDate) => {
  const today = new Date();
  return new Date(dueDate) < today;
};
