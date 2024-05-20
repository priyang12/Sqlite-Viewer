import { Table, flexRender } from "@tanstack/react-table";

function NoRows() {
  return (
    <div className="m-5 flex w-full justify-center text-center">No Data</div>
  );
}

const TableBody = ({ table }: { table: Table<unknown> }) => {
  return (
    <tbody className="w-full">
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}
              >
                <div
                  className="truncate text-center"
                  style={{
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            ))}
          </tr>
        ))
      ) : (
        <NoRows />
      )}
    </tbody>
  );
};

export default TableBody;
