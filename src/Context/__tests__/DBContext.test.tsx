import { act, render, screen } from "@testing-library/react";
import { DBProvider, useGetDBContext } from "../DBContext";
import { storeFileName, useIndexedDB } from "../../Hooks/useIndexedDB";
import { useGetDB } from "../../Hooks/useGetDB";
import { Mock } from "vitest";

// Mock the hooks
vi.mock("../../Hooks/useIndexedDB");
vi.mock("../../Hooks/useGetDB");

// Helper component to consume the context
const ConsumerComponent = () => {
  const { db, indexedDB, setDBFileName } = useGetDBContext();

  return (
    <div>
      <button onClick={() => setDBFileName("test.db")}>Set DB File Name</button>
      <div data-testid="db">{db ? "DB Loaded" : "No DB"}</div>
      <div data-testid="indexedDB">
        {indexedDB ? "IndexedDB Loaded" : "No IndexedDB"}
      </div>
    </div>
  );
};

describe("DBProvider", () => {
  let getMockedDB: Mock;
  let getMockedIndexedDB: Mock;

  beforeEach(() => {
    getMockedDB = vi.fn();
    getMockedIndexedDB = vi.fn();
  });

  test("provides default values", () => {
    (useIndexedDB as Mock).mockReturnValue({
      indexedDB: null,
    });
    (useGetDB as Mock).mockReturnValue({ db: null });
    render(
      <DBProvider>
        <ConsumerComponent />
      </DBProvider>,
    );

    expect(screen.getByTestId("db").textContent).toBe("No DB");
    expect(screen.getByTestId("indexedDB").textContent).toBe("No IndexedDB");
  });

  test("setDBFileName updates the context state", () => {
    (useIndexedDB as Mock).mockReturnValue({
      indexedDB: { get: getMockedIndexedDB },
    });
    (useGetDB as Mock).mockReturnValue({ db: getMockedDB });

    render(
      <DBProvider>
        <ConsumerComponent />
      </DBProvider>,
    );

    act(() => {
      const button = screen.getByText("Set DB File Name");
      button.click();
    });

    expect(getMockedIndexedDB).toHaveBeenCalledWith(storeFileName, "test.db");
  });
});
