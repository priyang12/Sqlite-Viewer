import React from "react";
import { Database } from "sql.js";
import { queries } from "../../Utils/queriesUtils";
import ConditionFilter from "./ConditionFilter";

// Current ability to build query.
// column selection, select table, where Condition.
// ex: SELECT col1, col2 FROM table_name WHERE search_condition;

type BuilderComponentType = {
  db: Database;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};
const BuilderComponent: React.FC<BuilderComponentType> = ({ db, setQuery }) => {
  const [tables, setTables] = React.useState<string[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<string>();
  const [columns, setColumns] = React.useState<string[]>([]);
  const [selectedCols, setSelectedCols] = React.useState<string[]>([]);
  const [whereConditions, setWhereConditions] = React.useState<string[]>();

  console.log(whereConditions);

  React.useEffect(() => {
    try {
      const result = db.exec(queries.table.allTables);
      const tableNames =
        result?.[0]?.values.map((row) => row[0] as string) || [];
      setTables(tableNames);
    } catch (err) {
      console.error("Failed to load tables", err);
    }
  }, [db]);

  React.useEffect(() => {
    if (!selectedTable) return;
    try {
      const result = db.exec(`PRAGMA table_info(${selectedTable})`);
      const columnNames =
        result?.[0]?.values.map((row) => row[1] as string) || [];
      setColumns(columnNames);
    } catch (err) {
      console.error(`Failed to get columns for ${selectedTable}`, err);
    }
  }, [selectedTable, db]);

  React.useEffect(() => {
    if (selectedCols.length === 0) {
      const query = `SELECT * FROM ${selectedTable};`;
      setQuery(query);
    }
    if (selectedTable && selectedCols.length > 0) {
      const query = `SELECT ${selectedCols.join(", ")} FROM ${selectedTable};`;
      setQuery(query);
    }
  }, [selectedTable, selectedCols]);

  React.useEffect(() => {
    if (whereConditions && whereConditions.length > 0) {
      setQuery((prevQuery) => {
        const whereClause = ` WHERE ${whereConditions.join(" AND ")}`;
        const semicolonIndex = prevQuery.lastIndexOf(";");
        const base = prevQuery.slice(0, semicolonIndex);
        return `${base}${whereClause};`;
      });
    }
  }, [whereConditions]);

  return (
    <div>
      <div className="mb-4 flex  resize-none flex-col gap-5 rounded border border-gray-300 p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div>
          <span>SELECT </span>
          <select
            multiple={!!selectedTable}
            className="border px-2 py-1"
            size={Math.min(columns.length, 6)}
            onChange={(e) =>
              setSelectedCols(
                Array.from(e.target.selectedOptions).map((opt) => opt.value),
              )
            }
            disabled={!columns.length}
          >
            {columns.map((col, index) => (
              <option key={col + index} value={col}>
                {col}
              </option>
            ))}
          </select>
          <span> FROM </span>
          <span>{`(`}</span>
          <select
            name="table"
            id="table"
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setColumns([]);
              setSelectedCols([]);
            }}
            value={selectedTable}
          >
            <option value="">-- Select Table --</option>
            {tables.map((name, index) => (
              <option value={name} key={index}>
                {name?.toString()}
              </option>
            ))}
          </select>
          <span>{`)`}</span>
        </div>
        <ConditionFilter
          setWhereConditions={setWhereConditions}
          columns={columns}
        />
      </div>
    </div>
  );
};
export default BuilderComponent;
