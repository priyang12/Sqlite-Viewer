import { render, fireEvent } from "@testing-library/react";
import SearchTable from "./SearchTable";
import "jsdom";
import { SqlValue } from "sql.js";
// import "@testing-library/jest-dom/vitest";

// Mock the setTables function
const mockSetTables = vi.fn();

describe("SearchTable component", () => {
  it("renders input field correctly", () => {
    const { getByPlaceholderText } = render(
      <SearchTable DBtables={[]} setTables={mockSetTables} />
    );
    const inputField = getByPlaceholderText("Search Table");
    expect(inputField).toBeInTheDocument();
  });

  it("calls onChange function when input changes", () => {
    const { getByPlaceholderText } = render(
      <SearchTable DBtables={[]} setTables={mockSetTables} />
    );
    const inputField = getByPlaceholderText("Search Table");
    fireEvent.change(inputField, { target: { value: "test" } });
    expect(mockSetTables).toHaveBeenCalled();
  });

  it("filters tables correctly based on search term", () => {
    const tables = ["table1", "table2", "table3"] as SqlValue[];
    const { getByPlaceholderText } = render(
      <SearchTable DBtables={tables} setTables={mockSetTables} />
    );
    const inputField = getByPlaceholderText("Search Table");
    fireEvent.change(inputField, { target: { value: "table2" } });
    expect(mockSetTables).toHaveBeenCalledWith([{ name: "table2" }]);
  });

  it("updates state correctly when tables are filtered", () => {
    const tables = ["table1", "table2", "table3"] as SqlValue[];
    const { getByPlaceholderText } = render(
      <SearchTable DBtables={tables} setTables={mockSetTables} />
    );
    const inputField = getByPlaceholderText("Search Table");
    fireEvent.change(inputField, { target: { value: "table2" } });
    expect(mockSetTables).toHaveBeenCalledWith([{ name: "table2" }]);
  });
});
