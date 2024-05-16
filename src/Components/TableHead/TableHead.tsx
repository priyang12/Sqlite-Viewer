import {
  ColumnResizeDirection,
  Header,
  Table,
  flexRender,
} from "@tanstack/react-table";
import Filter from "./Filter";
import { FaSortAlphaUp, FaSortAlphaDown } from "react-icons/fa";

function Th({
  header,
  columnResizeDirection,
}: {
  header: Header<unknown, unknown>;
  columnResizeDirection: ColumnResizeDirection | undefined;
}) {
  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
      }}
      className="relative border-2 border-primary text-center font-bold"
    >
      <div className="flex gap-5 p-3">
        <div className="flex flex-col items-center justify-center gap-5 px-0">
          {header.isPlaceholder ? null : (
            <>
              <div
                className={`flex items-center gap-5 truncate text-base
                        ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                onClick={header.column.getToggleSortingHandler()}
                title={
                  header.column.getCanSort()
                    ? header.column.getNextSortingOrder() === "asc"
                      ? "Sort ascending"
                      : header.column.getNextSortingOrder() === "desc"
                        ? "Sort descending"
                        : "Clear sort"
                    : undefined
                }
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {{
                  asc: <FaSortAlphaUp />,
                  desc: <FaSortAlphaDown />,
                }[header.column.getIsSorted() as string] ?? null}
              </div>
            </>
          )}
          {header.column.getCanFilter() ? (
            <div>
              <Filter inputWidth={header.getSize()} column={header.column} />
            </div>
          ) : null}
        </div>
        <div
          {...{
            onDoubleClick: () => header.column.resetSize(),
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `absolute cursor-col-resize resizer  top-0 right-0 h-full w-2 select-none touch-none ${columnResizeDirection} ${header.column.getIsResizing() ? "bg-blue-700 opacity-100" : ""}`,
          }}
        ></div>
      </div>
    </th>
  );
}

const TableHead = ({ table, ...props }: { table: Table<unknown> }) => {
  return (
    <thead className="" {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Th
              header={header}
              columnResizeDirection={table.options.columnResizeDirection}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;
