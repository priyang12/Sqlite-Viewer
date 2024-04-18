import { renderHook, waitFor } from "@testing-library/react";
import { useIndexedDB } from "../useIndexedDB";
import { openDB, IDBPDatabase } from "idb";
import { Mock } from "vitest";

vi.mock("idb");

describe("useIndexedDB Hook", () => {
  test("should create 'DBFiles' store during database upgrade", async () => {
    const createObjectStore = vi.fn(); // Mock createObjectStore method
    // Mock openDB function
    const openDBMock = vi
      .fn()
      .mockImplementation((name: string, version: number, options: any) => {
        // Simulate upgrade function
        if (options.upgrade) {
          // Create a mock IDBDatabase
          const mockIDBDatabase: any = {
            objectStoreNames: {
              contains: vi.fn().mockReturnValue(false), // Mock that 'DBFiles' store doesn't exist
            },
            createObjectStore: createObjectStore,
          };
          // Call the upgrade function
          options.upgrade(mockIDBDatabase);
        }
        return {} as IDBPDatabase<unknown>;
      });

    // Mock openDB function in idb
    (openDB as Mock).mockImplementation(openDBMock);

    // Render the hook
    renderHook(() => useIndexedDB());

    // Wait for the hook to finish updating
    await waitFor(() => {
      // Assert that openDB is called with the correct arguments
      expect(openDBMock).toHaveBeenCalledWith("FileStorage", 1, {
        upgrade: expect.any(Function),
      });
    });

    // Ensure that createObjectStore is called with 'DBFiles' if it doesn't exist
    expect(createObjectStore).toHaveBeenCalledWith("DBFiles");
  });

  test("should initialize IndexedDB and return database instance", async () => {
    // Mock openDB function
    const openDBMock = vi.fn().mockResolvedValue({} as IDBPDatabase<unknown>);
    (openDB as Mock<any>).mockImplementation(openDBMock);

    // Render the hook
    const { result } = renderHook(() => useIndexedDB());

    // Ensure that initially indexedDB state is undefined
    expect(result.current.indexedDB).toBeUndefined();

    // Wait for the hook to finish updating
    await waitFor(() => {
      // Assert that openDB is called with the correct arguments
      expect(openDBMock).toHaveBeenCalledWith("FileStorage", 1, {
        upgrade: expect.any(Function),
      });
    });

    // Ensure that indexedDB state is updated with the database instance
    expect(result.current.indexedDB).toBeDefined();
  });
});
