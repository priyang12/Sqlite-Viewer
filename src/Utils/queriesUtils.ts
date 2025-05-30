export const queries = {
  table: {
    allTables: "SELECT name FROM sqlite_master WHERE type='table'",
    properties: (name: string) => `PRAGMA table_info('${name}');`,
    foreignKey: (tableName: string) => `PRAGMA foreign_key_list(${tableName});`,
  },
};

export const OPERATORS = [
  "=",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "LIKE",
  "NOT LIKE",
  "IN",
  "NOT IN",
  "IS NULL",
  "IS NOT NULL",
];

export type Condition = {
  column: string;
  operator: string;
  value: string;
};

type QueryBuilderState = {
  table: string | null;
  selectedColumns: string[]; // SELECT col1, col2
  conditions: Array<Condition>;
  orderBy?: { column: string; direction: "ASC" | "DESC" };
  limit?: number;
};

// | Section        | UI Element                         | Notes                          |
// | -------------- | ---------------------------------- | ------------------------------ |
// | Table          | Dropdown (dynamic from db)         | From `sqlite_master`           |
// | Columns        | Multi-select / checkboxes          | From `PRAGMA table_info`       |
// | WHERE filters  | Repeating group: column, op, input | Add/remove rows dynamically    |
// | ORDER BY       | Dropdowns for col and direction    | Optional                       |
// | LIMIT          | Numeric input                      | Optional                       |
// | Query Preview  | Textarea (readonly)                | Useful for education/debugging |
// | Execute Button | Button                             | Runs `db.exec(query)`          |
// | Results        | Table                              | Show output or error           |

export function generateQuery(state: QueryBuilderState): string {
  const cols = state.selectedColumns.length
    ? state.selectedColumns.join(", ")
    : "*";

  const whereClause = state.conditions.length
    ? "WHERE " +
      state.conditions
        .map(
          ({ column, operator, value }) =>
            `${column} ${operator} '${value.replace(/'/g, "''")}'`,
        )
        .join(" AND ")
    : "";

  const orderByClause = state.orderBy
    ? `ORDER BY ${state.orderBy.column} ${state.orderBy.direction}`
    : "";

  const limitClause = state.limit ? `LIMIT ${state.limit}` : "";

  return `SELECT ${cols} FROM ${state.table} ${whereClause} ${orderByClause} ${limitClause};`;
}
