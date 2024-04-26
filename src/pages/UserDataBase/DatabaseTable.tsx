import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { useGetTableData } from "../../Hooks/useGetTableData";
import { createObject } from "../../Utils/tableUtils";
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

const DatabaseTable = () => {
  const { table: tableName } = useParams();
  const {
    columns: DBhead,
    row: DBrow,
    loading,
  } = useGetTableData(`SELECT * FROM ${tableName};`);

  const tableData = DBrow?.map((row) => createObject(row, DBhead));
  const tableColumns = DBhead?.map((item) =>
    columnHelper.accessor(item.toString(), {
      cell: (info) => info.getValue(),
    }),
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-16 flex flex-col items-center gap-5">
      <h2 className="my-5 self-start text-xl">Table : {tableName}</h2>
      <TableComponent columns={tableColumns} data={tableData} />
    </div>
  );
};

export default DatabaseTable;
