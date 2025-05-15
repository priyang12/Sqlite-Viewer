import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import Filter from "./Filter";
import { Column } from "@tanstack/react-table";

describe("Filter Component", () => {
  const mockColumn = {
    getFilterValue: vi.fn(),
    setFilterValue: vi.fn(),
    //   .mockImplementation((old: [number, number]) => [value, old?.[1]]),
    columnDef: { meta: {} },
  } as unknown as Column<any, unknown>;

  it("renders default text filter and handles changes", () => {
    (mockColumn.getFilterValue as Mock).mockReturnValue("test");
    mockColumn.columnDef.meta = { filterVariant: undefined };

    render(<Filter column={mockColumn} />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("test");

    fireEvent.change(input, { target: { value: "updated" } });
    expect(mockColumn.setFilterValue).toHaveBeenCalledWith("updated");
  });

  it("Range Filter", () => {
    (mockColumn.getFilterValue as Mock).mockReturnValue([10, 20]);
    mockColumn.columnDef.meta = { filterVariant: undefined };

    render(<Filter column={mockColumn} />);

    // add range Filer
    const rangeFilterBtn = screen.getByLabelText("Add Range Filter Button");
    fireEvent.click(rangeFilterBtn);
    expect(screen.getByLabelText("rangeFilter")).toBeInTheDocument();

    // check Range filter working.
    const minInput = screen.getByPlaceholderText("Min");
    const maxInput = screen.getByPlaceholderText("Max");

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
    expect(minInput).toHaveValue(10);
    expect(maxInput).toHaveValue(20);

    fireEvent.change(minInput, { target: { value: "15" } });
    fireEvent.change(maxInput, { target: { value: "25" } });

    // Ensure setFilterValue is called with a function
    // so that the filter is getting applied.
    expect(mockColumn.setFilterValue).toHaveBeenCalledWith(
      expect.any(Function),
    );

    // remove range Filter
    const removeBtn = screen.getByLabelText("remove Range Filter Button");
    fireEvent.click(removeBtn);

    expect(screen.queryByLabelText("rangeFilter")).not.toBeInTheDocument();
  });
});
