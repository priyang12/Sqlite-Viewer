// IndexDBContext.test.tsx
import { describe, it, expect, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { useIndexedDBContext } from "../IndexedDBContext";
import { useIndexedDB } from "../../Hooks/useIndexedDB";
import IndexDBProvider from "../IndexedDBContext";

// Mock the useIndexedDB hook
vi.mock("../../Hooks/useIndexedDB");

// Test component that consumes the context
const TestComponent = () => {
  const { indexDB } = useIndexedDBContext();

  return (
    <div data-testid="context-value">
      {indexDB ? "DB is available" : "No DB"}
    </div>
  );
};

describe("IndexDBContext", () => {
  it("provides the mocked indexedDB instance to consumers", () => {
    (useIndexedDB as Mock).mockReturnValue({
      indexedDB: {},
    });
    render(
      <IndexDBProvider>
        <TestComponent />
      </IndexDBProvider>,
    );

    const contextOutput = screen.getByTestId("context-value");
    expect(contextOutput).toHaveTextContent("DB is available");
  });
});
