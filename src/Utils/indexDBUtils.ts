import type { IDBPDatabase } from "idb";

/**
 * Inserts a file into the IndexedDB database.
 * @param {IDBPDatabase} indexedDB - The IndexedDB database instance.
 * @param {File} file - The file to insert.
 * @returns {Promise<any>} A promise that resolves with the result of the insertion.
 * @throws {Error} If an error occurs during the insertion process.
 * @example
 * // Usage example:
 * // Assuming 'db' is an open IDB database instance:
 * try {
 *   await insertDB(db, file);
 *   console.log('File inserted successfully.');
 * } catch (error) {
 *   console.error('Error inserting file:', error);
 * }
 */
export const insertDB = async (
  indexedDB: IDBPDatabase,
  file: File
): Promise<any> => {
  try {
    const transaction = indexedDB.transaction("DBFiles", "readwrite");
    const store = transaction.objectStore("DBFiles");
    const lastModifiedDate = new Date(file.lastModified);
    const dbKey = file.name + "-" + lastModifiedDate.toISOString();
    const result = await store.add(file, dbKey);
    await transaction.done;
    return result;
  } catch (error) {
    throw new Error(String(error));
  }
};

/**
 * Removes a file from the IndexedDB database.
 * @param {IDBPDatabase} indexedDB - The IndexedDB database instance.
 * @param {string} indexKey - The key of the file to remove.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating the success of the removal operation.
 * @throws {Error} If an error occurs during the removal process.
 * @example
 * // Usage example:
 * // Assuming 'db' is an open IDB database instance:
 * const indexKey = 'exampleFileKey';
 * try {
 *   const success = await removeDb(db, indexKey);
 *   if (success) {
 *     console.log('File removed successfully.');
 *   } else {
 *     console.log('File with key', indexKey, 'not found.');
 *   }
 * } catch (error) {
 *   console.error('Error removing file:', error);
 * }
 */
export const removeDb = async (
  indexedDB: IDBPDatabase,
  indexKey: string
): Promise<boolean> => {
  try {
    const transaction = indexedDB.transaction("DBFiles", "readwrite");
    const store = transaction.objectStore("DBFiles");
    await store.delete(indexKey);
    await transaction.done;
    return true;
  } catch (error) {
    throw new Error(String(error));
  }
};
