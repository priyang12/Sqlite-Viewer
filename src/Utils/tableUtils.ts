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
