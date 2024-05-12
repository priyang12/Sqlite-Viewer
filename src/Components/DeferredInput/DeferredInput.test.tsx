import { render, fireEvent, act } from "@testing-library/react";
import DeFerredInput from "./DeFerredInput";
import "@testing-library/jest-dom/vitest";

describe("DeFerredInput component", () => {
  it("renders with initial value", () => {
    const initialValue = "initial";
    const { getByDisplayValue } = render(
      <DeFerredInput value={initialValue} onChange={() => {}} />,
    );
    const inputElement = getByDisplayValue(initialValue);
    expect(inputElement).toBeInTheDocument();
  });

  it("updates value on input change", () => {
    const { getByDisplayValue } = render(
      <DeFerredInput value="" onChange={() => {}} />,
    );
    const newValue = "new value";
    const inputElement = getByDisplayValue("");
    fireEvent.change(inputElement, { target: { value: newValue } });
    expect(inputElement).toHaveValue(newValue);
  });

  it("calls onChange with updated value after defer", async () => {
    const onChangeMock = vi.fn();
    const { getByDisplayValue } = render(
      <DeFerredInput value="" onChange={onChangeMock} />,
    );
    const newValue = "new value";
    const inputElement = getByDisplayValue("");
    fireEvent.change(inputElement, { target: { value: newValue } });

    // Trigger the defer mechanism
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust timeout as per your useDeferredValue delay
    });

    expect(onChangeMock).toHaveBeenCalledWith(newValue);
  });
});
