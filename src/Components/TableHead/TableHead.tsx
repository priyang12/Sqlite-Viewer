import { Table, flexRender } from "@tanstack/react-table";
import Filter from "./Filter";
import { FaSortAlphaUp, FaSortAlphaDown, FaSort } from "react-icons/fa";
import "./index.css";

const TableHead = ({ table, ...props }: { table: Table<unknown> }) => {
  return (
    <thead className="flex w-full" {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className="flex rounded-lg border-2 border-primary px-5"
        >
          {headerGroup.headers.map((header) => (
            <>
              <th
                key={header.id}
                className="flex flex-col items-center justify-center gap-5 px-0"
              >
                {header.isPlaceholder ? null : (
                  <>
                    <div
                      className={`flex  items-center gap-5 text-base 
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
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} />
                      </div>
                    ) : null}
                  </>
                )}
              </th>
            </>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;
