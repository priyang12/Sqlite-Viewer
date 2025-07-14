import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useGetDBContext } from "../../Context/DBContext";
import { QueryExecResult } from "sql.js";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

const useFetchData = (parQuery: string | null) => {
  const { workerRef, dbLoaded } = useGetDBContext();
  const [result, setResult] = useState<QueryExecResult[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (parQuery && workerRef?.current && dbLoaded) {
        try {
          const res = await workerRef.current.exeQuery(parQuery);
          setResult(res);
          setError(undefined);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unknown error occurred.");
          }
          setResult(undefined);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [parQuery, dbLoaded]);
  return {
    result,
    error,
    isLoading,
  };
};

const BuilderTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const parQuery = searchParams.get("query");

  const { result, error, isLoading } = useFetchData(parQuery);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // change as needed
  });

  // Extract table data and column definitions
  const tableData = useMemo(() => {
    if (!result || result.length === 0) return [];
    const [first] = result;
    return first.values.map((row) => {
      const obj: Record<string, any> = {};
      first.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }, [result]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!result || result.length === 0) return [];
    return result[0].columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: ({ getValue }) => {
        const val = getValue();
        return typeof val === "string" && val.length > 50
          ? val.slice(0, 50) + "..."
          : String(val);
      },
    }));
  }, [result]);

  const table = useReactTable({
    data: tableData,
    columns,
    filterFns: {
      // @ts-ignore
      multipleFilter: undefined,
    },
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!parQuery) {
    const pathWithoutTable = location.pathname.replace(/\/table\/?$/, "");
    return <Navigate to={pathWithoutTable} replace={true} />;
  }

  return (
    <div className="p-4">
      <div className="flex w-[80vw] justify-between">
        <h1 className="mb-4 text-2xl font-semibold">Query: {parQuery}</h1>
        <Link
          to=".."
          relative="route"
          className="btn btn-info btn-sm text-white"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </Link>
      </div>

      {isLoading && (
        <div className="alert alert-info mb-4 shadow">
          <span>Running query...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4 shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {!error && !isLoading && tableData.length === 0 ? (
        <div className="alert alert-info mb-4 shadow">
          <span>No results returned.</span>
        </div>
      ) : null}

      <label htmlFor="Search" className="label label-text">
        Global Search
      </label>
      <input
        id="Search"
        type="text"
        placeholder="Search all columns..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="input input-primary mb-10"
      />

      {!error && tableData.length > 0 ? (
        <div className="h-[60vh] overflow-x-auto rounded border shadow">
          <table className="table table-zebra table-sm">
            <thead className="bg-base-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getPaginationRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="btn btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuilderTable;
