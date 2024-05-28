// types/react-table.d.ts

import { RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterFn, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range";
  }
  interface FilterFns {
    multipleFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
