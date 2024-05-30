import {
  ColumnResizeDirection,
  Header,
  Table,
  flexRender,
} from "@tanstack/react-table";
import Filter from "./Filter/Filter";

import IconComponent from "../IconComponent";
import { getCommonPinningStyles } from "../../Utils/tableUtils";

function PinComponent({
  isPlaceholder,
  canPin,
  getIsPinned,
  setPin,
}: {
  isPlaceholder: boolean;
  canPin: boolean;
  getIsPinned: "left" | "right" | false;
  setPin: (val: "left" | "right" | false) => void;
}) {
  return (
    <>
      {!isPlaceholder && canPin ? (
        <div className="flex justify-center gap-1">
          {!getIsPinned ? (
            <button
              className="text-4xl text-red-500"
              aria-label="set-pin"
              onClick={() => setPin("left")}
            >
              <IconComponent IconType="pinUp" />
            </button>
          ) : null}
          {getIsPinned ? (
            <button
              className="text-4xl text-red-500"
              aria-label="remove-pin"
              onClick={() => setPin(false)}
            >
              <IconComponent IconType="pinDown" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export function Th({
  header,
  columnResizeDirection,
}: {
  header: Header<unknown, unknown>;
  columnResizeDirection: ColumnResizeDirection | undefined;
}) {
  const headerFn = header.column.columnDef.header as any;
  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        ...getCommonPinningStyles(header.column),
      }}
      className="relative border-2 border-solid border-primary text-center font-bold"
    >
      <div className="flex gap-5 p-3">
        <div className="flex flex-col items-center justify-center gap-5 px-0">
          {header.isPlaceholder ? null : (
            <>
              <div
                role="button"
                className={`flex items-center gap-5 text-base ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                onClick={header.column.getToggleSortingHandler()}
                title={
                  header.column.getCanSort()
                    ? header.column.getNextSortingOrder() === "asc"
                      ? "Sort ascending"
                      : header.column.getNextSortingOrder() === "desc"
                        ? "Sort descending"
                        : "Clear sort"
                    : undefined
                }
                aria-label={"TableHead"}
              >
                <span className="flex flex-col">
                  {/* <p>{column.getIndex(column.getIsPinned() || "center")}</p> */}
                  {flexRender(
                    typeof headerFn === "function"
                      ? headerFn(header.getContext()).displayName
                      : headerFn,
                    header.getContext(),
                  )}
                </span>

                {typeof headerFn === "function" ? (
                  <span
                    className="tooltip text-3xl font-normal"
                    data-tip={flexRender(
                      headerFn(header.getContext()).dataType,
                      header.getContext(),
                    )}
                  >
                    <IconComponent
                      IconType={headerFn(header.getContext()).dataType}
                    />
                  </span>
                ) : null}
                {flexRender(
                  typeof headerFn === "function"
                    ? headerFn(header.getContext()).primaryKey
                    : headerFn,
                  header.getContext(),
                ) ? (
                  <span className="text-xs font-normal">🔑</span>
                ) : null}

                {flexRender(
                  typeof headerFn === "function"
                    ? headerFn(header.getContext()).foreignKey
                    : headerFn,
                  header.getContext(),
                ) ? (
                  <span className="text-xs font-normal" title="foreign Key">
                    🗝️
                  </span>
                ) : null}

                {{
                  asc: <IconComponent IconType="sortAlphaUp" />,
                  desc: <IconComponent IconType="sortAlphaDown" />,
                }[header.column.getIsSorted() as string] ?? null}
              </div>
            </>
          )}
          {header.column.getCanFilter() ? (
            <>
              <Filter inputWidth={header.getSize()} column={header.column} />
            </>
          ) : null}
        </div>
        <PinComponent
          isPlaceholder={header.isPlaceholder}
          canPin={header.column.getCanPin()}
          getIsPinned={header.column.getIsPinned()}
          setPin={(val) => header.column.pin(val)}
        />

        <div
          {...{
            onDoubleClick: () => header.column.resetSize(),
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `absolute cursor-col-resize resizer  top-0 right-0 h-full w-2 select-none touch-none ${columnResizeDirection} ${header.column.getIsResizing() ? "bg-blue-700 opacity-100" : ""}`,
          }}
          data-testid="resizerID"
        ></div>
      </div>
    </th>
  );
}

const TableHead = ({ table, ...props }: { table: Table<unknown> }) => {
  return (
    <thead className="" {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header, index) => (
            <Th
              key={index}
              header={header}
              columnResizeDirection={table.options.columnResizeDirection}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;
