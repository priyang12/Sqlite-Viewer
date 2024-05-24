import { render, fireEvent } from "@testing-library/react";
import TableHead, { Th } from "./TableHead";
import { FaSortAlphaUp, FaSortAlphaDown } from "react-icons/fa";
import type { Header, Table } from "@tanstack/react-table";

// Mock data and functions
const mockHeader = {
  id: "header-1",
  colSpan: 1,
  getSize: () => 150,
  isPlaceholder: false,
  column: {
    getCanSort: () => true,
    getToggleSortingHandler: vi.fn().mockReturnValue(vi.fn()),
    getCanFilter: () => false,
    getIsSorted: vi.fn(),
    getNextSortingOrder: vi.fn().mockReturnValue("asc"),
    resetSize: vi.fn(),
    getIsResizing: vi.fn(),
    columnDef: {
      header: () => {
        return { displayName: "Column Header" };
      },
    },
  },
  getContext: vi.fn(),
  getResizeHandler: vi.fn().mockReturnValue(vi.fn()),
};

const mockTable = {
  getHeaderGroups: () => [
    {
      id: "headerGroup-1",
      headers: [mockHeader],
    },
  ],
  options: {
    columnResizeDirection: undefined,
  },
};

describe("Th Component", () => {
  it("renders the header with sorting and filtering", () => {
    const { getByText, container } = render(
      <Th
        header={mockHeader as unknown as Header<unknown, unknown>}
        columnResizeDirection={undefined}
      />,
    );
    // Check if the header text is rendered
    expect(getByText("Column Header")).toBeInTheDocument();

    // Check if the sorting icons are rendered conditionally
    if (mockHeader.column.getIsSorted() === "asc") {
      expect(container.querySelector("svg")).toEqual(<FaSortAlphaUp />);
    } else if (mockHeader.column.getIsSorted() === "desc") {
      expect(container.querySelector("svg")).toEqual(<FaSortAlphaDown />);
    } else {
      expect(container.querySelector("svg")).toBeNull();
    }
  });

  it("calls the sorting handler on click", () => {
    const { getByText } = render(
      <Th
        header={mockHeader as unknown as Header<unknown, unknown>}
        columnResizeDirection={undefined}
      />,
    );

    fireEvent.click(getByText("Column Header"));
    expect(mockHeader.column.getToggleSortingHandler).toHaveBeenCalled();
  });

  it("calls the resize handler on mousedown and touchstart", () => {
    const { getByTestId } = render(
      <Th
        header={mockHeader as unknown as Header<unknown, unknown>}
        columnResizeDirection={undefined}
      />,
    );

    const resizer = getByTestId("resizerID");

    if (resizer) {
      fireEvent.mouseDown(resizer);
      fireEvent.touchStart(resizer);
      expect(mockHeader.getResizeHandler()).toHaveBeenCalledTimes(2);
    }
  });

  it("sorting false and undefined", () => {
    const { getByLabelText } = render(
      <Th
        header={
          {
            ...mockHeader,
            column: {
              ...mockHeader.column,
              getCanSort: () => false,
            },
          } as unknown as Header<unknown, unknown>
        }
        columnResizeDirection={undefined}
      />,
    );

    expect(getByLabelText("TableHead").title).toEqual("");
  });

  it("updates title attribute on click", () => {
    const { getByRole, rerender } = render(
      <table>
        <thead>
          <tr>
            <Th
              header={mockHeader as unknown as Header<unknown, unknown>}
              columnResizeDirection={undefined}
            />
          </tr>
        </thead>
      </table>,
    );

    // Check the initial title attribute
    const headerElement = getByRole("button", {
      name: "TableHead",
    });
    console.log(headerElement);

    expect(headerElement.title).toBe("Sort ascending");

    // Mock sorting state update to 'asc'
    mockHeader.column.getIsSorted.mockReturnValue("asc");
    mockHeader.column.getNextSortingOrder.mockReturnValue("desc");

    // Re-render to reflect the new sorting state
    rerender(
      <table>
        <thead>
          <tr>
            <Th
              header={mockHeader as unknown as Header<unknown, unknown>}
              columnResizeDirection={undefined}
            />
          </tr>
        </thead>
      </table>,
    );

    // // Check the updated title attribute
    expect(headerElement.title).toBe("Sort descending");

    // Mock sorting state update to 'desc'
    mockHeader.column.getIsSorted.mockReturnValue("desc");
    mockHeader.column.getNextSortingOrder.mockReturnValue(undefined);

    // Re-render to reflect the new sorting state
    rerender(
      <table>
        <thead>
          <tr>
            <Th
              header={mockHeader as unknown as Header<unknown, unknown>}
              columnResizeDirection={undefined}
            />
          </tr>
        </thead>
      </table>,
    );

    // Check the updated title attribute
    expect(headerElement.title).toBe("Clear sort");

    // Mock sorting state update to undefined (clear sort)
    mockHeader.column.getIsSorted.mockReturnValue(undefined);
    mockHeader.column.getNextSortingOrder.mockReturnValue("asc");

    // Re-render to reflect the new sorting state
    rerender(
      <table>
        <thead>
          <tr>
            <Th
              header={mockHeader as unknown as Header<unknown, unknown>}
              columnResizeDirection={undefined}
            />
          </tr>
        </thead>
      </table>,
    );

    // Check the updated title attribute
    expect(headerElement.title).toBe("Sort ascending");
  });
  it("test headerFn", () => {
    const { getByText } = render(
      <Th
        header={
          {
            ...mockHeader,
            column: {
              ...mockHeader.column,
              columnDef: {
                header: "Column Header",
              },
            },
          } as unknown as Header<unknown, unknown>
        }
        columnResizeDirection={undefined}
      />,
    );
    expect(getByText("Column Header")).toBeInTheDocument();
  });
});

describe("TableHead Component", () => {
  it("renders header groups and headers", () => {
    const { getByText } = render(
      <table>
        <TableHead table={mockTable as unknown as Table<unknown>} />
      </table>,
    );

    // Check if the header text is rendered
    expect(getByText("Column Header")).toBeInTheDocument();
  });

  it("renders multiple headers correctly", () => {
    const multipleHeadersTable = {
      ...mockTable,
      getHeaderGroups: () => [
        {
          id: "headerGroup-1",
          headers: [
            mockHeader,
            {
              ...mockHeader,
              id: "header-2",
              column: {
                ...mockHeader.column,
                columnDef: {
                  header: () => {
                    return { displayName: "Second Column" };
                  },
                },
              },
            },
          ],
        },
      ],
    };

    const { getByText } = render(
      <table>
        <TableHead table={multipleHeadersTable as unknown as Table<unknown>} />
      </table>,
    );

    // Check if both headers are rendered
    expect(getByText("Column Header")).toBeInTheDocument();
    expect(getByText("Second Column")).toBeInTheDocument();
  });
});
