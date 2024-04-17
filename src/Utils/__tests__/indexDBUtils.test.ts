import { IDBPDatabase } from "idb";
import { insertDB, removeDb } from "../indexDBUtils"; // Replace 'yourFile' with the actual file name
import { getDBKey } from "../dateUtils";

// Mock IDBPDatabase
const mockAdd = vi.fn().mockResolvedValue("mockKey");
const mockDelete = vi.fn();
const mockTransaction = vi.fn().mockReturnValue({
  objectStore: vi.fn().mockReturnValue({
    add: mockAdd,
    delete: mockDelete,
  }),
  done: Promise.resolve(),
});

// Mock IDBPDatabase
const mockIndexedDB = {
  transaction: mockTransaction,
} as unknown as IDBPDatabase<unknown>;

// Test the insertDB function
it("inserts a file into the IndexedDB database", async () => {
  const file = new File(["content"], "example.txt", {
    type: "text/plain",
    lastModified: Date.now(),
  });

  const result = await insertDB(mockIndexedDB, file);

  expect(result).toBe("mockKey");
  expect(mockAdd).toHaveBeenCalledWith(file, getDBKey(file));
});

// Test the removeDb function
it("removes a file from the IndexedDB database", async () => {
  const mockIndexKey = "exampleFileKey";
  const result = await removeDb(mockIndexedDB, mockIndexKey);
  expect(result).toBe(true);
  expect(mockDelete).toHaveBeenCalledWith(mockIndexKey);
});
