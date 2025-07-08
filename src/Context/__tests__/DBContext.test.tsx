import { render, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { DBProvider, useGetDBContext } from "../DBContext";
import { useParams } from "react-router-dom";
import { useIndexedDBContext } from "../IndexedDBContext";
import { loadDatabase } from "../../Hooks/useGetDB";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("../IndexedDBContext", () => ({
  useIndexedDBContext: vi.fn(),
}));

vi.mock("../../Hooks/useGetDB", () => ({
  loadDatabase: vi.fn(),
}));

describe("DBProvider", () => {
  // removed old test cases since we have changed the API.
  const mockDb = { exec: vi.fn() } as any;
  const mockIndexedDB = {
    get: vi.fn(),
  };

  const TestConsumer = () => {
    const { db, indexedDB } = useGetDBContext();
    return (
      <div>
        <div data-testid="db">{db ? "loaded" : "undefined"}</div>
        <div data-testid="indexedDB">
          {indexedDB ? "available" : "undefined"}
        </div>
      </div>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("provides default undefined values", () => {
    (useParams as any).mockReturnValue({});
    (useIndexedDBContext as any).mockReturnValue({ indexDB: undefined });

    const { getByTestId } = render(
      <DBProvider>
        <TestConsumer />
      </DBProvider>,
    );

    expect(getByTestId("db").textContent).toBe("undefined");
    expect(getByTestId("indexedDB").textContent).toBe("undefined");
  });

  it("loads database and provides it via context", async () => {
    const fakeBinaryData = new Uint8Array([1, 2, 3]);

    (useParams as any).mockReturnValue({ name: "test.db" });
    (useIndexedDBContext as any).mockReturnValue({ indexDB: mockIndexedDB });
    mockIndexedDB.get.mockResolvedValue(fakeBinaryData);
    (loadDatabase as any).mockResolvedValue(mockDb);

    const { getByTestId } = render(
      <DBProvider>
        <TestConsumer />
      </DBProvider>,
    );

    // wait for async db loading
    await waitFor(() => {
      expect(getByTestId("db").textContent).toBe("loaded");
      expect(getByTestId("indexedDB").textContent).toBe("available");
    });

    expect(mockIndexedDB.get).toHaveBeenCalledWith("DBFiles", "test.db");
    expect(loadDatabase).toHaveBeenCalledWith(fakeBinaryData);
  });

  it("does not try to load database if no name param", async () => {
    (useParams as any).mockReturnValue({});
    (useIndexedDBContext as any).mockReturnValue({ indexDB: mockIndexedDB });

    const { getByTestId } = render(
      <DBProvider>
        <TestConsumer />
      </DBProvider>,
    );

    expect(mockIndexedDB.get).not.toHaveBeenCalled();
    expect(loadDatabase).not.toHaveBeenCalled();

    expect(getByTestId("db").textContent).toBe("undefined");
    expect(getByTestId("indexedDB").textContent).toBe("available");
  });
});
