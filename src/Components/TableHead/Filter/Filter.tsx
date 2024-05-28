import { Column } from "@tanstack/react-table";
import DebouncedInput from "../../DeferredInput";

const Filter = ({
  column,
}: {
  column: Column<any, unknown>;
  inputWidth: number;
}) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return (
    <>
      <DebouncedInput
        className="input input-xs input-accent w-full rounded border text-sm shadow"
        onChange={(value) => {
          column.setFilterValue(value);
        }}
        placeholder={`Search...`}
        type="text"
        value={(columnFilterValue ?? "") as string}
      />
      {filterVariant === "range" ? (
        <>
          <div className="flex space-x-2">
            <DebouncedInput
              type="number"
              value={(columnFilterValue as [number, number])?.[0] ?? ""}
              onChange={(value) => {
                column.setFilterValue((old: [number, number]) => [
                  value,
                  old?.[1],
                ]);
              }}
              placeholder={`Min`}
              className="input input-xs input-accent w-full rounded border text-sm shadow"
            />
            <DebouncedInput
              type="number"
              value={(columnFilterValue as [number, number])?.[1] ?? ""}
              onChange={(value) =>
                column.setFilterValue((old: [number, number]) => [
                  old?.[0],
                  value,
                ])
              }
              placeholder={`Max`}
              className="input input-xs input-accent w-full rounded border text-sm shadow"
            />
          </div>
          <div className="h-1" />
        </>
      ) : null}
    </>
  );
};

export default Filter;
