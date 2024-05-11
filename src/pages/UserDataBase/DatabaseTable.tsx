import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import { createObject } from "../../Utils/tableUtils";
import { useGetSubStrQuery } from "../../Hooks/useGetSubStrQuery";
import Loading from "../../Components/Loading";

function TableComponent({ columns, data }: { columns: any; data: any }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: data,
    debugTable: true,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  if (!columns || !data) {
    return null;
  }

  return (
    <div className="w-max-96 h-[80vh] overflow-x-auto">
      <table className="table table-pin-rows table-pin-cols table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
      <div className="flex items-center gap-2">
        <button
          className="rounded border p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const columnHelper = createColumnHelper<any>();

function Table({ querySubstr }: { querySubstr: string | undefined }) {
  const { columns: DBhead, row: DBrow, loading } = useGetTableData(querySubstr);
  const tableData = DBrow?.map((row) => createObject(row, DBhead));

  const tableColumns = DBhead?.map((item) =>
    columnHelper.accessor(item.toString(), {
      cell: (info) => info.getValue(),
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
    <div className="mx-16 flex flex-col items-center gap-5">
      <h2 className="my-5 self-start text-xl">Table : {tableName}</h2>
      <Table querySubstr={querySubstr} />
    </div>
  );
};

export default DatabaseTable;
