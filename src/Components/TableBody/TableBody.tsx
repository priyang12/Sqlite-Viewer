import { Table, flexRender } from "@tanstack/react-table";
import { generateMockData } from "../../Utils/tableUtils";

const numRows = 10;
const numCols = 10;
const { tableBody } = generateMockData(numRows, numCols);

const TableBody = ({ table }: { table: Table<unknown> }) => {
  return (
    <tbody className="">
      {/* {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="truncate"
              style={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))} */}
      {tableBody.map((row, index) => (
        <tr key={index} className="">
          {row.map((cell) => (
            <td className="truncate border-2 border-solid border-primary">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
