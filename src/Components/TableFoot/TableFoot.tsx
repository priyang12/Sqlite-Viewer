import { Table, flexRender } from "@tanstack/react-table";

const TableFoot = ({ table }: { table: Table<unknown> }) => {
  return (
    <tfoot className="">
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
  );
};

export default TableFoot;
