import { describe, it, expect, vi, Mock } from "vitest";
import { multipleFilter } from "../filterUtils";
import { Row } from "@tanstack/react-table";

describe("multipleFilter", () => {
  const mockRow = {
    getValue: vi.fn(),
  } as unknown as Row<any>;
  const mockAddMeta = vi.fn();

  it("filters by string and includes value", () => {
    (mockRow.getValue as Mock).mockReturnValue("testValue");
    const result = multipleFilter(mockRow, "columnId", "test", mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(true);
    expect(mockAddMeta).toHaveBeenCalledWith({
      itemRank: expect.objectContaining({ passed: true }),
    });
  });

  it("filters by string and does not include value", () => {
    (mockRow.getValue as Mock).mockReturnValue("testValue");
    const result = multipleFilter(mockRow, "columnId", "noMatch", mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(false);
    expect(mockAddMeta).toHaveBeenCalledWith({
      itemRank: expect.objectContaining({ passed: false }),
    });
  });

  it("filters by range with both min2 and max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(15);
    const result = multipleFilter(mockRow, "columnId", [10, 20], mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(true);
  });

  it("filters by range with only min2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(15);
    const result = multipleFilter(mockRow, "columnId", [10, ""], mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(true);
  });

  it("filters by range with only max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(5);
    const result = multipleFilter(mockRow, "columnId", ["", 10], mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(true);
  });

  it("filters by range with neither min2 nor max2 provided", () => {
    (mockRow.getValue as Mock).mockReturnValue(5);
    const result = multipleFilter(mockRow, "columnId", ["", ""], mockAddMeta);

    expect(mockRow.getValue).toHaveBeenCalledWith("columnId");
    expect(result).toBe(true);
  });
});
