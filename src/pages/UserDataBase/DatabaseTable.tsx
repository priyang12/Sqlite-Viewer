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
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import { createObject } from "../../Utils/tableUtils";
import { useGetSubStrQuery } from "../../Hooks/useGetSubStrQuery";
import {
  FaAngleRight,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
} from "react-icons/fa";
import Loading from "../../Components/Loading";
import TableHead from "../../Components/TableHead";
import TableBody from "../../Components/TableBody";

const pageSizes = [10, 20, 30, 40, 50];

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
    columnResizeMode: "onChange",
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
        <table className="table table-pin-rows table-pin-cols w-full table-fixed">
          <TableHead table={table} />
          <TableBody table={table} />
          {/* <tfoot>
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
          </tfoot> */}
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
      // footer: (props) => props.column.id,
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
    <div className="mx-5 flex flex-col items-center gap-5">
      <h2 className="my-5 self-start text-xl">Table : {tableName}</h2>
      <Table querySubstr={querySubstr} />
    </div>
  );
};

export default DatabaseTable;
