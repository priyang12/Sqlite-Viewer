import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { queries } from "../../Utils/queriesUtils";
import { Database } from "sql.js";
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
import Loading from "../Loading";

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

  useEffect(() => {
    try {
      const result = db.exec(queries.table.properties(tableName));
      const columnMetaData = columnData(result);
      setTableInfo(columnMetaData);
    } catch (err: any) {
      // handle error (optionally)
    } finally {
      setLoading(false);
    }
  }, [db, tableName]);

  return (
    <div className="bg-card text-card-foreground hover:ring-1border-gray-300 relative rounded-md border bg-base-200 p-2 text-base-content">
      <h3 className="text-md mb-2 font-semibold ">{tableName}</h3>
      <div className="border-spacing-10 overflow-visible">
        {loading ? (
          <div className="flex h-[10rem] items-center gap-5">
            <Loading />
            <p className="text-sm text-gray-300">Loading...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableInfo
                ? Object.keys(tableInfo).map((col, idx) => (
                    <TableRow className="relative" key={idx}>
                      <TableCell className="p-2">
                        <div
                          className="relative flex flex-row items-center"
                          title={col.toString()}
                        >
                          <TableHandle
                            type="target"
                            className="-translate-y-1/2 translate-x-[-200%]"
                            id={`target-${col.toString()}`}
                            position={Position.Left}
                          />
                          <span className="">{col}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="relative flex justify-end">
                          <span>
                            {tableInfo?.[col.toString()]?.type ?? "Unknown"}
                            <TableHandle
                              type="source"
                              className="-translate-y-1/2 translate-x-[200%]"
                              id={`source-${col.toString()}`}
                              position={Position.Right}
                            />
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TableNode;
