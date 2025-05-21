import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { queries } from "../../Utils/queriesUtils";
import { Database, SqlValue } from "sql.js";
import { columnData } from "../../Utils/tableUtils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./Table";

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
  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState<TableInfo>();
  const [columns, setColumns] = useState<SqlValue[]>([]);

  useEffect(() => {
    try {
      const result = db.exec(queries.table.properties(tableName));
      const props = result[0]?.values.map((r) => r[1]) || [];
      const columnMetaData = columnData(result);
      setColumns(props);
      setTableInfo(columnMetaData);
    } catch (err: any) {
      // handle error (optionally)
    } finally {
      setLoading(false);
    }
  }, [db, tableName]);

  return (
    <div className="min-w-[200px] rounded-md border border-gray-300 bg-white p-4 shadow-md">
      <h3 className="text-md mb-2 font-semibold text-gray-800">{tableName}</h3>
      <div className="max-h-48 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((col, idx) => (
                <TableRow key={idx}>
                  {col ? (
                    <>
                      <TableCell>{col}</TableCell>
                      <TableCell>
                        {tableInfo?.[col.toString()]?.type ?? "Unknown"}
                      </TableCell>
                    </>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TableNode;
