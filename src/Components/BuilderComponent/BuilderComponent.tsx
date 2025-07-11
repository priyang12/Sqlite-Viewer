import React from "react";
import ConditionFilter from "./ConditionFilter";
import { useGetDBContext } from "../../Context/DBContext";

// Current ability to build query.
// column selection, select table, where Condition.
// ex: SELECT col1, col2 FROM table_name WHERE search_condition;

type BuilderComponentType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};
const BuilderComponent: React.FC<BuilderComponentType> = ({ setQuery }) => {
  const { workerRef } = useGetDBContext();
  const [tables, setTables] = React.useState<string[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<string>();
  const [columns, setColumns] = React.useState<string[]>([]);
  const [selectedCols, setSelectedCols] = React.useState<string[]>([]);
  const [whereConditions, setWhereConditions] = React.useState<string[]>();

  React.useEffect(() => {
    (async () => {
      if (workerRef?.current) {
        try {
          const result = await workerRef.current.getAllTables();
          if (result) {
            const tableNames =
              result?.[0]?.values.map((row) => row[0] as string) || [];
            setTables(tableNames);
          }
        } catch (err) {
          console.error("Failed to load tables", err);
        }
      }
    })();
  }, [workerRef?.current]);

  React.useEffect(() => {
    if (!selectedTable) return;
    (async () => {
      try {
        if (workerRef?.current) {
          const result = await workerRef.current.getTableColumns(selectedTable);
          const columnNames =
            result?.[0]?.values.map((row) => row[1] as string) || [];
          setColumns(columnNames);
        }
      } catch (err) {
        console.error(`Failed to get columns for ${selectedTable}`, err);
      }
    })();
  }, [selectedTable]);

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
        const semicolonIndex = prevQuery.lastIndexOf(";");
        const baseQuery =
          semicolonIndex !== -1
            ? prevQuery.slice(0, semicolonIndex)
            : prevQuery;

        // Remove existing WHERE clause if present
        const whereRegex =
          /\s+WHERE\s+[\s\S]*?(?=(GROUP\s+BY|ORDER\s+BY|LIMIT|$))/i;
        const queryWithoutWhere = baseQuery.replace(whereRegex, "");

        // Append new WHERE clause
        const newWhereClause = ` WHERE ${whereConditions.join(" AND ")}`;
        return `${queryWithoutWhere}${newWhereClause};`;
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
            size={Math.min(columns.length, 6)}
            disabled={!columns.length}
            onChange={(e) =>
              setSelectedCols(
                Array.from(e.target.selectedOptions).map((opt) => opt.value),
              )
            }
            className="select select-bordered my-2 h-auto min-h-[8rem] w-full p-2 text-sm focus:outline-none focus:ring focus:ring-primary/50 disabled:opacity-50"
          >
            {columns.map((col, index) => (
              <option key={col + index} value={col} className="text-sm">
                {col}
              </option>
            ))}
          </select>
          <span> FROM </span>
          <span>{`(`}</span>
          <select
            name="table"
            id="table"
            className="min-h-auto select select-bordered h-auto"
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
