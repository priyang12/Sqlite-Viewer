import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TableFoot from "./TableFoot";
import { Table } from "@tanstack/react-table";

// Mock flexRender
vi.mock("@tanstack/react-table", () => ({
  ...vi.importActual("@tanstack/react-table"),
  flexRender: vi.fn((Component, props) => <div>{Component(props)}</div>),
}));

const mockFooterGroup = (footerGroups: any[]) => ({
  footerGroups: footerGroups.map((group: any, groupIndex: number) => ({
    id: `footerGroup-${groupIndex}`,
    headers: group.map((header: any, headerIndex: number) => ({
      id: `footerHeader-${groupIndex}-${headerIndex}`,
      isPlaceholder: false,
      column: {
        columnDef: { footer: ({ getValue }: any) => getValue() },
      },
      getContext: () => header.context,
    })),
  })),
});

describe("TableFoot Component", () => {
  it("renders footer groups and headers correctly", () => {
    const mockTable = {
      getFooterGroups: () =>
        mockFooterGroup([
          [{ footer: "Footer 1", context: { getValue: () => "Footer 1" } }],
          [{ footer: "Footer 2", context: { getValue: () => "Footer 2" } }],
        ]).footerGroups,
    } as unknown as Table<unknown>;

    render(<TableFoot table={mockTable} />);

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("Footer 1")).toBeInTheDocument();
    expect(screen.getByText("Footer 2")).toBeInTheDocument();
  });

  it("renders nothing for placeholder headers", () => {
    const mockTable = {
      getFooterGroups: () =>
        mockFooterGroup([
          [
            {
              isPlaceholder: true,
              footer: null,
              context: { getValue: () => null },
            },
          ],
        ]).footerGroups,
    } as unknown as Table<unknown>;

    render(<TableFoot table={mockTable} />);

    expect(screen.queryByText("Footer 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Footer 2")).not.toBeInTheDocument();
  });
});
