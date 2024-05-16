import { Table, flexRender } from "@tanstack/react-table";

const TableBody = ({ table }: { table: Table<unknown> }) => {
  return (
    <tbody className="">
      {table.getRowModel().rows.map((row) => (
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
      ))}
    </tbody>
  );
};

export default TableBody;
