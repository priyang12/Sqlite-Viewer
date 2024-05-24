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

  it("renders range filter and handles changes", () => {
    (mockColumn.getFilterValue as Mock).mockReturnValue([10, 20]);
    mockColumn.columnDef.meta = { filterVariant: "range" };

    render(<Filter column={mockColumn} inputWidth={100} />);

    const minInput = screen.getByPlaceholderText("Min");
    const maxInput = screen.getByPlaceholderText("Max");

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
    expect(minInput).toHaveValue(10);
    expect(maxInput).toHaveValue(20);

    fireEvent.change(minInput, { target: { value: "15" } });
    fireEvent.change(maxInput, { target: { value: "25" } });

    // Ensure setFilterValue is called with a function
    expect(mockColumn.setFilterValue).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it("renders select filter and handles changes", () => {
    (mockColumn.getFilterValue as Mock).mockReturnValue("single");
    mockColumn.columnDef.meta = { filterVariant: "select" };

    render(<Filter column={mockColumn} inputWidth={100} />);

    const select = screen.getByDisplayValue("single");
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "relationship" } });
    expect(mockColumn.setFilterValue).toHaveBeenCalledWith("relationship");
  });

  it("renders default text filter and handles changes", () => {
    (mockColumn.getFilterValue as Mock).mockReturnValue("test");
    mockColumn.columnDef.meta = { filterVariant: "" };

    render(<Filter column={mockColumn} inputWidth={100} />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("test");

    fireEvent.change(input, { target: { value: "updated" } });
    expect(mockColumn.setFilterValue).toHaveBeenCalledWith("updated");
  });
});
