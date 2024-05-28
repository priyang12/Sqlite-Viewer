import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";

export const multipleFilter: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  if (typeof value === "string") {
    // return (row.getValue(id) as string).includes(value);
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  }

  if (typeof value === "object") {
    let [min2, max2] = value;
    const rowValue = row.getValue(columnId) as number;
    if (min2 !== "" && max2 !== "") {
      return rowValue >= Number(min2) && rowValue <= Number(max2);
    } else if (min2 !== "" && max2 === "") {
      return rowValue >= Number(min2);
    } else if (min2 === "" && max2 !== "") {
      return rowValue <= Number(max2);
    } else {
      // If both min2 and max2 are empty, we assume no filtering is applied, hence all rows match.
      return true;
    }
  }
  return value;
};
