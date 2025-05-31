import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ErrorFallbackComponent from "./ErrorFallbackComponent";

describe("ErrorFallbackComponent", () => {
  it("should render error message and retry button", () => {
    const mockError = new Error("Test error message");
    const mockReset = vi.fn();

    render(
      <ErrorFallbackComponent
        error={mockError}
        resetErrorBoundary={mockReset}
      />,
    );

    // text content check
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();

    // reset click check
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });
});
