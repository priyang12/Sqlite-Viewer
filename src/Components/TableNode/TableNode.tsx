import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { queries } from "../../Utils/queriesUtils";
import { Database, SqlValue } from "sql.js";
import { columnData } from "../../Utils/tableUtils";

type Props = {
  id: string;
  data: {
    db: Database;
    tableName: string;
  };
};

type TableInfo = {
  [columnName: string]: {
    type: string;
    pk: number;
  };
};

const TableNode: React.FC<Props> = ({ data: { db, tableName } }) => {
  const [loading, setLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<TableInfo>();
  const [columns, setColumns] = useState<SqlValue[]>([]);

  useEffect(() => {
    try {
      const result = db.exec(queries.table.properties(tableName));
      const props = result[0]?.values.map((r) => r[1]) || [];
      setColumns(props);
      const columnMetaData = columnData(
        db.exec(queries.table.properties(tableName)),
      );
      setTableInfo(columnMetaData);
    } catch (err: any) {
      // throw error
    } finally {
      setLoading(false);
    }
  }, [db, tableName]);

  return (
    <div className="min-w-[200px] rounded-md border border-gray-300 bg-white p-4 shadow-md">
      <Handle type="target" position={Position.Top} />
      <h3 className="text-md mb-2 font-semibold text-gray-800">{tableName}</h3>
      <div className="max-h-48 overflow-y-auto">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && (
          <table className="w-full border-t border-gray-200 text-left text-sm">
            <thead>
              <tr>
                <th className="py-1 font-medium text-gray-500">Column</th>
                <th className="py-1 font-medium text-gray-500">Types</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col, idx) => (
                <tr key={idx}>
                  <td className="border-t border-gray-100 py-1">{col}</td>
                  {tableInfo && col ? (
                    <td className="border-t border-gray-100 py-1">
                      {tableInfo[col.toString()].type}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TableNode;
