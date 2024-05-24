import TableSideBar from "./TableSideBar";
import { render, screen, fireEvent } from "@testing-library/react";
import { useGetData } from "../../Hooks/useGetData";
import { Mock } from "vitest";

import { BrowserRouter } from "react-router-dom";

// Mock the useGetData hook
vi.mock("../../Hooks/useGetData", () => ({
  __esModule: true,
  useGetData: vi.fn(),
}));

describe("TableSideBar Component", () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    vi.clearAllMocks();
  });

  it("renders loading spinner when loading", () => {
    // Mock the useGetData hook to return loading state
    (useGetData as Mock).mockReturnValue({ row: null, loading: true });
    render(
      <BrowserRouter>
        <TableSideBar />
      </BrowserRouter>,
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders table names when data is fetched", () => {
    const tables = ["Table1", "Table2", "Table3"];
    // Mock the useGetData hook to return fetched data
    (useGetData as Mock).mockReturnValue({ row: tables, loading: false });
    render(
      <BrowserRouter>
        <TableSideBar />
      </BrowserRouter>,
    );
    tables.forEach((tableName) => {
      expect(screen.getByText(tableName)).toBeInTheDocument();
    });
  });

  it("renders no tables message when there are no tables", () => {
    // Mock the useGetData hook to return no data
    (useGetData as Mock).mockReturnValue({ row: [], loading: false });
    render(<TableSideBar />);
    expect(screen.getByText("No Tables in Database.")).toBeInTheDocument();
  });

  it("filters tables based on search input", () => {
    const tables = ["Table1", "Table2", "Table3"];
    (useGetData as Mock).mockReturnValue({ row: tables, loading: false });
    render(
      <BrowserRouter>
        <TableSideBar />
      </BrowserRouter>,
    );
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "Table1" } });
    expect(screen.getByText("Table1")).toBeInTheDocument();
    expect(screen.queryByText("Table2")).not.toBeInTheDocument();
    expect(screen.queryByText("Table3")).not.toBeInTheDocument();
  });
});
