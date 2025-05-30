import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConditionFilter from "./ConditionFilter";

describe("ConditionFilter", () => {
  it("should render WHERE text and checkbox", () => {
    const mockSetWhereConditions = vi.fn();
    render(
      <ConditionFilter
        columns={[]}
        setWhereConditions={mockSetWhereConditions}
      />,
    );

    expect(screen.getByText("WHERE")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should toggle conditions on checkbox click", () => {
    const mockSetWhereConditions = vi.fn();
    render(
      <ConditionFilter
        columns={[]}
        setWhereConditions={mockSetWhereConditions}
      />,
    );

    const checkbox = screen.getByRole("checkbox");

    // initially unchecked
    expect(checkbox).not.toBeChecked();

    // click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // click again to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should toggle conditions on Enter key", () => {
    const mockSetWhereConditions = vi.fn();
    render(
      <ConditionFilter
        columns={[]}
        setWhereConditions={mockSetWhereConditions}
      />,
    );

    const checkbox = screen.getByRole("checkbox");

    // press enter to check
    fireEvent.keyDown(checkbox, { key: "Enter", code: "Enter" });
    expect(checkbox).toBeChecked();

    // press enter again to uncheck
    fireEvent.keyDown(checkbox, { key: "Enter", code: "Enter" });
    expect(checkbox).not.toBeChecked();
  });
});
