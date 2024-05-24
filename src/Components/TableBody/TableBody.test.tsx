import { render, screen } from "@testing-library/react";
import { Table } from "@tanstack/react-table";
import TableBody from "./TableBody";

// Mock flexRender
vi.mock("@tanstack/react-table", () => ({
  ...vi.importActual("@tanstack/react-table"),
  flexRender: vi.fn((Component, props) => <div>{Component(props)}</div>),
}));

const mockRowModel = (rows: any[]) => ({
  rows: rows.map((row, rowIndex) => ({
    id: `row-${rowIndex}`,
    getVisibleCells: () =>
      row.map((cell: any, cellIndex: number) => ({
        id: `cell-${rowIndex}-${cellIndex}`,
        column: {
          getSize: () => 100,
          columnDef: { cell: ({ getValue }: any) => getValue() },
        },
        getContext: () => ({
          getValue: () => cell,
        }),
      })),
  })),
});

describe("TableBody Component", () => {
  it("renders table rows and cells when there is data", () => {
    const mockTable = {
      getRowModel: () =>
        mockRowModel([
          [1, 2],
          [3, 4],
        ]),
    } as unknown as Table<unknown>;

    render(<TableBody table={mockTable} />);

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getAllByRole("cell")).toHaveLength(4);
  });

  it("renders NoRows component when there is no data", () => {
    const mockTable = {
      getRowModel: () => mockRowModel([]),
    } as unknown as Table<unknown>;

    render(<TableBody table={mockTable} />);

    expect(screen.getByText("No Data")).toBeInTheDocument();
  });
});
