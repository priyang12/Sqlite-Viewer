import React, { memo } from "react";
import { Position } from "@xyflow/react";
import { useTableInfo } from "./useTableInfo";
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

type TableInfo = {
  [columnName: string]: {
    type: string;
    pk: number;
  };
};

function TableComponent({ tableInfo }: { tableInfo: TableInfo }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Column</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(tableInfo).map((col, idx) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
const MemoedTableComponent = memo(TableComponent);

type Props = {
  id: string;
  data: {
    tableName: string;
  };
};

const TableNode: React.FC<Props> = ({ data: { tableName } }) => {
  const { loading, tableInfo } = useTableInfo(tableName);

  return (
    <div className="bg-card text-card-foreground hover:ring-1border-gray-300 relative rounded-md border bg-base-200 p-2 text-base-content">
      <h3 className="text-md mb-2 font-semibold ">{tableName}</h3>
      <div className="border-spacing-10 overflow-visible">
        {loading ? (
          <div className="flex h-[10rem] items-center gap-5">
            <Loading />
            <p className="text-sm text-gray-300">Loading...</p>
          </div>
        ) : null}
        {tableInfo ? <MemoedTableComponent tableInfo={tableInfo} /> : null}
      </div>
    </div>
  );
};

export default TableNode;
