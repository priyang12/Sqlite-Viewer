import type { SqlValue } from "sql.js";
import { queryType } from "../Hooks/useSqlQueries";
import { CSSProperties } from "react";
import { Column } from "@tanstack/react-table";

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

/**
 * Generates a SQL query to retrieve data from a specified table with column name substrings.
 *
 * @param {string} tableName - The name of the table.
 * @returns {string} The SQL query to retrieve data with column name substrings.
 * @example
 * // Example usage:
 * const tableName = "example_table";
 * const query = getTableQuery(tableName);
 * // 'query' contains the SQL query to retrieve data from 'example_table' with column name substrings
 */
export function getTableQuery(tableName: string) {
  const query = `WITH columns AS (
        SELECT name
        FROM pragma_table_info('${tableName}')
      )
      SELECT 
        'SELECT ' || GROUP_CONCAT('substr(' || name || ', 1, 100) AS ' || name) AS query
      FROM columns;`;
  return query;
}

/**
 * Generates mock data for a table with a specified number of rows and columns.
 * @param {number} numRows - The number of rows in the table.
 * @param {number} numCols - The number of columns in the table.
 * @returns {Object} An object containing mock headers and table body with rows inside cells.
 * @example
 * // Example usage:
 * const numRows = 3;
 * const numCols = 4;
 * const { headers, tableBody } = generateMockData(numRows, numCols);
 * // 'headers' contains an array of mock column headers
 * // 'tableBody' contains an array of arrays representing table rows and cells
 */
export function generateMockData(numRows: number, numCols: number) {
  // Generate headers
  const headers = [];
  for (let i = 1; i <= numCols; i++) {
    headers.push(`Header ${i}`);
  }

  // Generate table body with rows
  const tableBody = [];
  for (let i = 1; i <= numRows; i++) {
    const row = [];
    for (let j = 1; j <= numCols; j++) {
      row.push(`Row ${i}, Cell ${j}`);
    }
    tableBody.push(row);
  }

  return { headers, tableBody };
}

/**
 * Transforms the table information result into an object where each key is the 'name' and its value
 * is an object containing 'type' and 'pk' properties.
 *
 * @export
 * @param {queryType} tableInfoResult - The result of a table information query containing column definitions and values.
 * @return {*} An object with 'name' as keys and an object containing 'type' and 'pk' as values.
 * @example
 * // Given the following input:
 * const tableInfoResult = [
 *   {
 *     columns: ['cid', 'name', 'type', 'notnull', 'dflt_value', 'pk'],
 *     values: [
 *       [0, 'id', 'INTEGER', 1, null, 1],
 *       [1, 'name', 'TEXT', 1, null, 0],
 *       [2, 'age', 'INTEGER', 0, null, 0]
 *     ]
 *   }
 * ];
 *
 * // The function call:
 * const result = columnData(tableInfoResult);
 *
 * // Will produce:
 * // {
 * //   id: { type: 'INTEGER', pk: 1 },
 * //   name: { type: 'TEXT', pk: 0 },
 * //   age: { type: 'INTEGER', pk: 0 }
 * // }
 */

export function columnData(tableInfoResult: queryType) {
  // Step 1: Get the indices of 'name', 'type', and 'pk'
  let nameIndex: number, typeIndex: number, pkIndex: number;
  tableInfoResult[0].columns.forEach((column, index) => {
    if (column === "name") nameIndex = index;
    if (column === "type") typeIndex = index;
    if (column === "pk") pkIndex = index;
  });

  const result = tableInfoResult[0].values.reduce((acc: any, row) => {
    const name = String(row[nameIndex]);
    const type = row[typeIndex];
    const pk = row[pkIndex];
    acc[name] = { type, pk };
    return acc;
  }, {});

  return result;
}

/**
 * Returns a set of common styles for pinned columns in a table.
 * The styles are based on the column's pinning state (left or right) and its position.
 *
 * @param {Column<unknown>} column - The column object to retrieve styles for.
 * @returns {CSSProperties} An object containing the CSS properties for the column.
 *
 * @example
 * const column = {
 *   getIsPinned: () => 'left',
 *   getIsLastColumn: (position) => position === 'left',
 *   getIsFirstColumn: (position) => position === 'right',
 *   getStart: (position) => 100,
 *   getAfter: (position) => 200,
 *   getSize: () => '150px',
 * };
 *
 * const styles = getCommonPinningStyles(column);
 * console.log(styles);
 * // Output:
 * // {
 * //   boxShadow: '-4px 0 4px -4px gray inset',
 * //   backgroundColor: '#475569',
 * //   left: '100px',
 * //   right: undefined,
 * //   opacity: 0.95,
 * //   position: 'sticky',
 * //   width: '150px',
 * //   zIndex: 1,
 * //   border: '5px solid red',
 * // }
 */
export const getCommonPinningStyles = (
  column: Column<unknown>,
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    backgroundColor: isPinned === "left" ? "#475569" : "",
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 1 : 0,
    border: isPinned ? "5px solid red" : "",
  };
};
