export const normalizeText = (text = "") => {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n/g, "")
    .trim();
};
