import type { SqlValue } from "sql.js";

/**
 * Function to create objects with properties from tableHead.
 * @param {SqlValue[]} row - Array containing values from a row in a SQL table.
 * @param {string[] | undefined} tableHead - Array of column names from the table.
 * @returns {Object} Object with properties based on tableHead and corresponding values from row.
 * @example
 * // Usage:
 * const tableHead = ['Name', 'Age', 'Location'];
 * const row = [['John', 30, 'New York']];
 * const tableData = row?.map((row) => createObject(row, DBhead));
 * console.log(tableData) // [{'Name' : 'John', 'Age': 30, 'Location': ''New York}]
 */

export function createObject(
  row: SqlValue[],
  tableHead: string[] | undefined,
): object {
  const obj = {} as any;
  tableHead?.forEach((key, index) => {
    obj[key] = row[index];
  });
  return obj;
}
