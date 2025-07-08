import { describe, it, expect, vi, Mock } from "vitest";
import { multipleFilter } from "../filterUtils";
import { Row } from "@tanstack/react-table";

describe("multipleFilter", () => {
  const mockRow = {
    getValue: vi.fn(),
  } as unknown as Row<any>;
  const mockAddMeta = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("filters by 'search' and includes value", () => {
    (mockRow.getValue as Mock).mockReturnValue("testValue");

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "search", filterValue: "test" },
      mockAddMeta,
    );

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(typeof result).toBe("boolean");
    expect(mockAddMeta).toHaveBeenCalledWith({
      itemRank: expect.objectContaining({ passed: expect.any(Boolean) }),
    });
  });

  it("filters by 'search' and does not include value", () => {
    (mockRow.getValue as Mock).mockReturnValue("testValue");

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "search", filterValue: "noMatch" },
      mockAddMeta,
    );

    expect(result).toBe(false);
    expect(mockAddMeta).toHaveBeenCalledWith({
      itemRank: expect.objectContaining({ passed: false }),
    });
  });

  it("filters by 'range' with both min2 and max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(15);

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "range", filterValue: [10, 20] },
      mockAddMeta,
    );

    expect(result).toBe(true);
  });

  it("filters by 'range' with only min2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(15);

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "range", filterValue: [10, ""] },
      mockAddMeta,
    );

    expect(result).toBe(true);
  });

  it("filters by 'range' with only max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(5);

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "range", filterValue: ["", 10] },
      mockAddMeta,
    );

    expect(result).toBe(true);
  });

  it("filters by 'range' with neither min2 nor max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(5);

    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "range", filterValue: ["", ""] },
      mockAddMeta,
    );

    expect(result).toBe(true); // no filtering applied
  });

  it("returns filterValues if type is unknown", () => {
    const result = multipleFilter(
      mockRow,
      "columnId",
      { type: "unknown" as any, filterValue: "something" },
      mockAddMeta,
    );

    expect(result).toEqual({ type: "unknown", filterValue: "something" });
  });
});
