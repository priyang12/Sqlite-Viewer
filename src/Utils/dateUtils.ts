/**
 * Generates a unique key for a file based on its name and last modified date.
 * @param {File} file - The file for which to generate the key.
 * @returns {string} A unique key for the file.
 * @example
 * // Usage example:
 * const file = new File(["content"], "example.txt", { type: "text/plain", lastModified: Date.now() });
 * const key = getDBKey(file);
 * console.log(key); // Output: "example.txt-2024-04-18T09:30:00.000Z"
 */
export const getDBKey = (file: File) => {
  const lastModifiedDate = new Date(file.lastModified);
  const dbKey = file.name + "-" + lastModifiedDate.toISOString();
  return dbKey;
};
