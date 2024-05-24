import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  PaginationState,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
  Table as TableType,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import useSqlQueries, { queryType } from "../../Hooks/useSqlQueries";
import { columnData, createObject } from "../../Utils/tableUtils";
import { useGetSubStrQuery } from "../../Hooks/useGetSubStrQuery";
import {
  FaAngleRight,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
} from "react-icons/fa";
import TableHead from "../../Components/TableHead";
import TableBody from "../../Components/TableBody";
import TableFoot from "../../Components/TableFoot";
import Skeleton from "../../Components/Skeleton";
import Loading from "../../Components/Loading";

const pageSizes = [10, 20, 30, 40, 50];

function Pagination({ table }: { table: TableType<unknown> }) {
  return (
    <div className="my-3 flex w-full flex-col items-center gap-3 rounded-lg bg-base-300 p-5">
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
    // debugTable: true,
    columns: columns,
    filterFns: {},
    state: {
      columnFilters: columnFilters,
      pagination: pagination,
      sorting: sorting,
    },
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
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
      <div className="overflow-auto">
        <table
          className="table table-pin-rows"
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <TableHead table={table} />
          <TableBody table={table} />
          <TableFoot table={table} />
        </table>
      </div>
      <Pagination table={table} />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-evenly">
        <Skeleton width="100px" height="100px" count={6} />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex justify-evenly" key={index}>
          <Skeleton
            width="100px"
            height="50px"
            count={6}
            className="rounded-none border-2 border-primary opacity-70"
          />
        </div>
      ))}
      <div className="my-3 flex">
        <Skeleton width="100%" height="100px" />
      </div>
    </div>
  );
}

const columnHelper = createColumnHelper<any>();

function Table({
  querySubstr,
  tableInfoResult,
  foreignKeyResult,
}: {
  querySubstr: string | undefined;
  tableInfoResult: queryType;
  foreignKeyResult: queryType;
}) {
  // get index of property in which stored the foreign Keys.
  const propertyIndex =
    foreignKeyResult.length > 0
      ? foreignKeyResult[0].columns.findIndex(
          (val) => val.toString() === "from",
        )
      : null;
  const foreignKeys =
    foreignKeyResult.length > 0 && propertyIndex
      ? foreignKeyResult[0].values.map((item) => item[propertyIndex])
      : null;

  const columnMetaData = columnData(tableInfoResult);

  const { columns: DBhead, row: DBrow, loading } = useGetTableData(querySubstr);

  const tableData = DBrow?.map((row) => createObject(row, DBhead));
  const tableColumns = DBhead?.map((item) =>
    columnHelper.accessor(item.toString(), {
      cell: (info) => info.getValue(),
      header: (info) => {
        const customObject = {
          displayName: info.column.id,
          dataType: columnMetaData[item.toString()].type,
          primaryKey: columnMetaData[item.toString()].pk,
          foreignKey: foreignKeys ? foreignKeys.includes(item) : false,
        };
        return customObject;
      },
      footer: (props) => props.column.id,
      sortUndefined: "last",
      sortDescFirst: false,
    }),
  );

  if (!querySubstr) return null;

  if (loading) {
    return <TableSkeleton />;
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

  // Memoize the queries array to prevent infinite re-renders
  const queries = useMemo(
    () => [
      `PRAGMA table_info(${tableName});`,
      `PRAGMA foreign_key_list(${tableName});`,
    ],
    [tableName],
  );
  const { results, loading } = useSqlQueries(queries);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-5 h-full">
      <h2 className="my-5 self-start text-xl">Table : {tableName}</h2>

      {results.length > 0 ? (
        <Table
          querySubstr={querySubstr}
          tableInfoResult={results[0]}
          foreignKeyResult={results.length > 1 ? results[1] : []}
        />
      ) : null}
    </div>
  );
};

export default DatabaseTable;
