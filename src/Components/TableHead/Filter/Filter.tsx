import { useCallback, useState } from "react";
import { Column } from "@tanstack/react-table";
import DebouncedInput from "../../DeferredInput";

function RangeFilter({
  columnFilterValue,
  minFn,
  maxFn,
}: {
  columnFilterValue: unknown;
  minFn: (value: string | number) => void;
  maxFn: (value: string | number) => void;
}) {
  return (
    <>
      <div className="flex space-x-2" aria-label="rangeFilter">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={minFn}
          placeholder={`Min`}
          className="input input-xs input-accent w-full rounded border text-sm shadow"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={maxFn}
          placeholder={`Max`}
          className="input input-xs input-accent w-full rounded border text-sm shadow"
        />
      </div>
      <div className="h-1" />
    </>
  );
}

const rangeFilterName = "rangeFilter";
const dataTypes = ["INTEGER"];

const Filter = ({
  column,
  dataType,
}: {
  column: Column<any, unknown>;
  dataType: String;
}) => {
  const [filters, setFilters] = useState<string[]>([]);
  const columnFilterValue = column.getFilterValue();

  const searchFiler = useCallback(
    (value: string | number) => {
      column.setFilterValue({
        type: "search",
        filterValue: value,
      });
    },
    [column],
  );

  const minFn = useCallback(
    (value: string | number) => {
      // column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
      column.setFilterValue((old: { filterValue: [number, number] }) => {
        const oldValue = old.filterValue;
        return { type: "range", filterValue: [value, oldValue?.[1]] };
      });
    },
    [column],
  );

  const maxFn = useCallback(
    (value: string | number) => {
      column.setFilterValue((old: { filterValue: [number, number] }) => {
        // column.setFilterValue((old: [number, number]) => [old?.[0], value]),
        const oldValue = old.filterValue;
        return { type: "range", filterValue: [oldValue?.[0], value] };
      });
    },
    [column],
  );

  const addFilter = (type: string) => {
    if (filters.length < 3) {
      setFilters([...filters, type]);
    }
  };

  const removeFilter = (type: string) => {
    const newFilters = filters.filter((filterType) => filterType !== type);
    setFilters(newFilters);
    column.setFilterValue(undefined);
  };

  return (
    <>
      <DebouncedInput
        className="input input-xs input-accent w-full rounded border text-sm shadow"
        onChange={searchFiler}
        placeholder={`Search...`}
        type="text"
        value={(columnFilterValue ?? "") as string}
      />

      {filters.some((value) => value === rangeFilterName) ? (
        <div className="flex">
          <RangeFilter
            maxFn={maxFn}
            minFn={minFn}
            columnFilterValue={columnFilterValue}
          />
          <button
            aria-label="remove Range Filter Button"
            onClick={() => removeFilter(rangeFilterName)}
          >
            remove
          </button>
        </div>
      ) : null}

      <div className="flex space-x-2">
        {filters.length < 2 && dataTypes.includes(dataType.toString()) ? (
          <>
            {!filters.some((filter) => filter === rangeFilterName) && (
              <button
                onClick={() => addFilter(rangeFilterName)}
                className="btn btn-primary btn-xs"
                aria-label="Add Range Filter Button"
              >
                Add Range Filter
              </button>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Filter;
