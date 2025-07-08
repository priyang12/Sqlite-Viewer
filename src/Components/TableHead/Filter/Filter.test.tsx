import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Filter from "./Filter";
import { Column } from "@tanstack/react-table";

describe("Filter Component", () => {
  it("renders default text filter and handles changes", () => {
    const setFilterValue = vi.fn();
    const mockColumn = {
      getFilterValue: vi.fn().mockReturnValue("test"),
      setFilterValue,
      columnDef: { meta: {} },
    } as unknown as Column<any, unknown>;

    render(<Filter dataType="" column={mockColumn} />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("test");

    fireEvent.change(input, { target: { value: "updated" } });
    expect(setFilterValue).toHaveBeenCalledWith({
      type: "search",
      filterValue: "updated",
    });
  });

  it("adds and removes Range Filter and handles min/max input changes", () => {
    const setFilterValue = vi.fn();
    const mockColumn = {
      getFilterValue: vi.fn().mockReturnValue([10, 20]),
      setFilterValue,
      columnDef: { meta: {} },
    } as unknown as Column<any, unknown>;

    render(<Filter dataType="INTEGER" column={mockColumn} />);

    // Add range filter
    const rangeFilterBtn = screen.getByLabelText("Add Range Filter Button");
    fireEvent.click(rangeFilterBtn);
    expect(screen.getByLabelText("rangeFilter")).toBeInTheDocument();

    // Inputs
    const minInput = screen.getByPlaceholderText("Min");
    const maxInput = screen.getByPlaceholderText("Max");

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
    expect(minInput).toHaveValue(10);
    expect(maxInput).toHaveValue(20);

    fireEvent.change(minInput, { target: { value: "15" } });
    fireEvent.change(maxInput, { target: { value: "25" } });

    // setFilterValue should be called with a function for both min/max changes
    expect(setFilterValue).toHaveBeenCalledWith(expect.any(Function));

    // Remove range filter
    const removeBtn = screen.getByLabelText("remove Range Filter Button");
    fireEvent.click(removeBtn);
    expect(screen.queryByLabelText("rangeFilter")).not.toBeInTheDocument();
  });
});
