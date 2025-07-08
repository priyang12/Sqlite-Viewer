import { render, fireEvent } from "@testing-library/react";
import SearchTable from "./SearchTable";
import { SqlValue } from "sql.js";

// Mock the setTables function
const mockSetTables = vi.fn();

describe("SearchTable component", () => {
  it("renders input field correctly", () => {
    const { getByPlaceholderText } = render(
      <SearchTable originalTable={[]} setSearchTables={mockSetTables} />,
    );
    const inputField = getByPlaceholderText("Search Table");
    expect(inputField).toBeInTheDocument();
  });

  it("calls onChange function when input changes", () => {
    const { getByPlaceholderText } = render(
      <SearchTable originalTable={[]} setSearchTables={mockSetTables} />,
    );
    const inputField = getByPlaceholderText("Search Table");
    fireEvent.change(inputField, { target: { value: "test" } });
    expect(mockSetTables).toHaveBeenCalled();
  });

  it("filters tables correctly based on search term", () => {
    const tables = ["abc", "abcd", "xyz"] as SqlValue[];
    const { getByPlaceholderText } = render(
      <SearchTable originalTable={tables} setSearchTables={mockSetTables} />,
    );
    const inputField = getByPlaceholderText("Search Table");
    fireEvent.change(inputField, { target: { value: "ab" } });
    expect(mockSetTables).toHaveBeenCalledWith(["abc", "abcd"]);
  });
});
