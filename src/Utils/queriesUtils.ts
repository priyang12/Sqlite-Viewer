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

export function isSelectQuery(query: string): boolean {
  const cleaned = query.trim().toLowerCase();

  // Quick basic filter
  const forbiddenKeywords = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "create",
    "replace",
    "truncate",
  ];
  if (!cleaned.startsWith("select")) return false;

  // Check for forbidden keywords anywhere in the query
  return !forbiddenKeywords.some((kw) => cleaned.includes(kw));
}

type ParsedQuery = {
  tableName?: string;
  selectedCols: string[];
  whereConditions: string[];
};

// fn to extract populate data from query
// need to change the condition data structure later
// currently this setup don't work for ConditionFilter UI since the
// data structure is quite different.
export function getDataFromQuery(query: string): ParsedQuery {
  const cleanedQuery = query.trim().replace(/\s+/g, " ");
  const selectedCols: string[] = [];
  let tableName: string | undefined;
  let whereConditions: string[] = [];

  // Extract SELECT columns
  const selectMatch = cleanedQuery.match(/SELECT (.+?) FROM/i);
  if (selectMatch) {
    const cols = selectMatch[1].trim();
    selectedCols.push(
      ...(cols === "*" ? ["*"] : cols.split(",").map((col) => col.trim())),
    );
  }

  // Extract table name
  const fromMatch = cleanedQuery.match(/FROM\s+([^\s;]+)/i);
  if (fromMatch) {
    tableName = fromMatch[1];
  }

  // Extract WHERE conditions
  const whereMatch = cleanedQuery.match(
    /WHERE\s+(.+?)(ORDER BY|GROUP BY|LIMIT|$)/i,
  );
  if (whereMatch) {
    const conditions = whereMatch[1].trim();
    // Split by AND/OR while keeping conditions clean
    whereConditions = conditions
      .split(/(?:\s+AND\s+|\s+OR\s+)/i)
      .map((c) => c.trim())
      .filter(Boolean);
  }

  return {
    tableName,
    selectedCols,
    whereConditions,
  };
}
