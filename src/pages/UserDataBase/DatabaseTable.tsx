import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
  PaginationState,
  ColumnFiltersState,
  Column,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import { createObject } from "../../Utils/tableUtils";
import { useGetSubStrQuery } from "../../Hooks/useGetSubStrQuery";
import Loading from "../../Components/Loading";
import DebouncedInput from "../../Components/DeferredInput";
import {
  FaAngleRight,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
} from "react-icons/fa";

const pageSizes = [10, 20, 30, 40, 50];

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = (column.columnDef.meta ?? {}) as {
    filterVariant: string;
  };

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 rounded border shadow"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 rounded border shadow"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="complicated">complicated</option>
      <option value="relationship">relationship</option>
      <option value="single">single</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-36 rounded border shadow"
      onChange={(value) => {
        column.setFilterValue(value);
      }}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

function TableComponent({ columns, data }: { columns: any; data: any }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data,
    debugTable: true,
    columns: columns,
    filterFns: {},
    state: {
      columnFilters: columnFilters,
      pagination: pagination,
      sorting: sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
  });

  if (!columns || !data) {
    return null;
  }

  return (
    <>
      <div className="w-max-96 relative h-[80vh] overflow-x-auto">
        <table className="table table-pin-rows table-pin-cols table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
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
                            asc: " 🔼",
                            desc: " 🔽",
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
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
      <div className="flex w-full flex-col items-center gap-3 rounded-lg bg-base-300 p-5">
        <div className="flex gap-5 self-start">
          <div className="join" aria-label="pagination">
            <button
              className="btn join-item"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              className="btn join-item"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleLeft />
            </button>
            <div className="btn join-item">
              {table.getState().pagination.pageIndex + 1}
            </div>
            <button
              className="btn join-item"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleRight />
            </button>
            <button
              className="btn join-item"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
        </div>
        <div className="flex self-end">
          <span className="flex items-center">
            Go to page :
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                if (page !== 0 && page > 0 && page < table.getPageCount()) {
                  table.setPageIndex(page);
                } else {
                  e.target.value = "";
                }
              }}
              className="mx-3 w-1/4 rounded border p-1"
            />
          </span>
          <select
            className="select select-bordered w-full max-w-xs"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {pageSizes.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

const columnHelper = createColumnHelper<any>();

function Table({ querySubstr }: { querySubstr: string | undefined }) {
  const { columns: DBhead, row: DBrow, loading } = useGetTableData(querySubstr);
  const tableData = DBrow?.map((row) => createObject(row, DBhead));

  const tableColumns = DBhead?.map((item) =>
    columnHelper.accessor(item.toString(), {
      cell: (info) => info.getValue(),
      sortUndefined: "last",
      sortDescFirst: false,
    }),
  );

  if (!querySubstr) return null;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <TableComponent columns={tableColumns} data={tableData} />
    </>
  );
}

const DatabaseTable = () => {
  const { table: tableName } = useParams();
  const { querySubstr } = useGetSubStrQuery(tableName);

  return (
    <div className="mx-14 flex flex-col items-center gap-5">
      <h2 className="my-5 self-start text-xl">Table : {tableName}</h2>
      <Table querySubstr={querySubstr} />
    </div>
  );
};

export default DatabaseTable;
