import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import { createObject } from "../../Utils/tableUtils";
import { useGetSubStrQuery } from "../../Hooks/useGetSubStrQuery";
import Loading from "../../Components/Loading";

function TableComponent({ columns, data }: { columns: any; data: any }) {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
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
    </div>
  );
}

const columnHelper = createColumnHelper<any>();

function Table({ querySubstr }: { querySubstr: string }) {
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
      <Table querySubstr={querySubstr ? querySubstr : ""} />
    </div>
  );
};

export default DatabaseTable;
