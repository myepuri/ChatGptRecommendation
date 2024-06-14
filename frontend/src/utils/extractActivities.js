export default function extractActivities(category, inputString) {
  const regexPattern = new RegExp(`${category}:\\n(.*?)(\\n\\n|$)`, "s");

  const matches = inputString.match(regexPattern);
  if (matches && matches[1]) {
    return matches[1]
      .trim()
      .split("\n")
      .map((item) => item.replace(/^\d+\.\s*/, "").trim());
  } else {
    return [];
  }
}
