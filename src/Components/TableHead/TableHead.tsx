import {
  ColumnResizeDirection,
  Header,
  Table,
  flexRender,
} from "@tanstack/react-table";
import Filter from "./Filter/Filter";

import IconComponent from "../IconComponent";
import { getCommonPinningStyles } from "../../Utils/tableUtils";

function ColumnType({ dataType }: { dataType: string }) {
  return (
    <span className="tooltip text-3xl font-normal" data-tip={dataType}>
      <IconComponent IconType={dataType} />
    </span>
  );
}

function Resizer({
  header,
  columnResizeDirection,
}: {
  header: Header<unknown, unknown>;
  columnResizeDirection: ColumnResizeDirection | undefined;
}) {
  return (
    <div
      {...{
        onDoubleClick: () => header.column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute cursor-col-resize resizer top-0 right-0 h-full w-2 select-none touch-none ${columnResizeDirection} ${header.column.getIsResizing() ? "bg-blue-700 opacity-100" : ""}`,
      }}
      data-testid="resizerID"
    ></div>
  );
}

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
    <div className="absolute right-3 top-2">
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
    </div>
  );
}

export function Th({
  header,
  columnResizeDirection,
}: {
  header: Header<unknown, unknown>;
  columnResizeDirection: ColumnResizeDirection | undefined;
}) {
  const headerFn = header.column.columnDef.header;
  const dataType =
    typeof headerFn === "function"
      ? headerFn(header.getContext()).dataType
      : undefined;

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
            <div
              role="button"
              aria-label={"TableHead"}
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
                <ColumnType
                  dataType={
                    flexRender(
                      headerFn(header.getContext()).dataType,
                      header.getContext(),
                    ) as string
                  }
                />
              ) : null}

              {typeof headerFn === "function" ? (
                flexRender(
                  headerFn(header.getContext()).primaryKey,
                  header.getContext(),
                ) ? (
                  <span className="text-lg font-normal" title="primary Key">
                    <IconComponent IconType="primaryKey" />
                  </span>
                ) : null
              ) : null}

              {typeof headerFn === "function" ? (
                flexRender(
                  headerFn(header.getContext()).foreignKey,
                  header.getContext(),
                ) ? (
                  <span className="text-lg font-normal" title="foreign Key">
                    <IconComponent IconType="foreignKey" />
                  </span>
                ) : null
              ) : null}

              {{
                asc: <IconComponent IconType="sortAlphaUp" />,
                desc: <IconComponent IconType="sortAlphaDown" />,
              }[header.column.getIsSorted() as string] ?? null}
            </div>
          )}
          {header.column.getCanFilter() ? (
            <>
              <Filter column={header.column} dataType={String(dataType)} />
            </>
          ) : null}
        </div>
        <PinComponent
          isPlaceholder={header.isPlaceholder}
          canPin={header.column.getCanPin()}
          getIsPinned={header.column.getIsPinned()}
          setPin={(val) => header.column.pin(val)}
        />
        <Resizer
          header={header}
          columnResizeDirection={columnResizeDirection}
        />
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
