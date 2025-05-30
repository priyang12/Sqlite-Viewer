import TableSideBar from "./TableSideBar";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

function createMockDB(tables: string[] = []) {
  return {
    exec: vi.fn(() => [
      {
        values: tables.map((table) => [table]),
      },
    ]),
  } as any;
}

describe("TableSideBar Component", () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    vi.clearAllMocks();
  });

  it("renders table names when data is fetched", () => {
    const tables = ["Table1", "Table2", "Table3"];
    const db = createMockDB(["Table1", "Table2", "Table3"]);

    render(
      <BrowserRouter>
        <TableSideBar db={db} />
      </BrowserRouter>,
    );
    tables.forEach((tableName) => {
      expect(screen.getByText(tableName)).toBeInTheDocument();
    });
  });

  it("renders no tables message when there are no tables", () => {
    const db = createMockDB([]);
    render(
      <BrowserRouter>
        <TableSideBar db={db} />
      </BrowserRouter>,
    );
    expect(screen.getByText("No Tables in Database.")).toBeInTheDocument();
  });

  it("filters tables based on search input", () => {
    const db = createMockDB(["Table1", "Table2", "Table3"]);

    render(
      <BrowserRouter>
        <TableSideBar db={db} />
      </BrowserRouter>,
    );
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "Table1" } });
    expect(screen.getByText("Table1")).toBeInTheDocument();
    expect(screen.queryByText("Table2")).not.toBeInTheDocument();
    expect(screen.queryByText("Table3")).not.toBeInTheDocument();
  });
});
