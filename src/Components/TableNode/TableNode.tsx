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
  TableHandle,
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
    <div className="bg-card text-card-foreground hover:ring-1border-gray-300 relative rounded-md border bg-white p-5">
      <h3 className="text-md mb-2 font-semibold text-gray-800">{tableName}</h3>
      <div className="border-spacing-10 overflow-visible">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-800">Column</TableHead>
                <TableHead className="text-gray-800">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((col, idx) => (
                <TableRow className="" key={idx}>
                  {col ? (
                    <>
                      <TableCell className="p-2">
                        <div
                          className="relative flex flex-row items-center"
                          title={col.toString()}
                        >
                          <TableHandle
                            type="target"
                            id={`target-${col}`}
                            position={Position.Left}
                          />
                          <span className="text-gray-800">{col}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="relative flex justify-end">
                          <span>
                            {tableInfo?.[col.toString()]?.type ?? "Unknown"}
                            <TableHandle
                              type="source"
                              id={`source-${col}`}
                              position={Position.Right}
                            />
                          </span>
                        </div>
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
