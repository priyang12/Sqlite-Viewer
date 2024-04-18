import { renderHook, waitFor } from "@testing-library/react";
import { useGetUserDBs } from "../useGetUserDBs";
import { DBContextType } from "../../Context/DBContext";

describe("useGetUserDBs Hook", () => {
  test("should retrieve stored database keys", async () => {
    // Mock indexedDB context
    const indexedDBMock = {
      getAllKeys: vi.fn().mockResolvedValue(["db1", "db2", "db3"]),
    } as unknown as DBContextType["indexedDB"];

    // Render the hook with the mocked indexedDB context
    const { result } = renderHook(() => useGetUserDBs(indexedDBMock));

    // Ensure that initially storedDBs is an empty array
    expect(result.current.storedDBs).toEqual([]);

    // Wait for the hook to finish updating
    await waitFor(() => {
      // Assert that storedDBs is updated with the retrieved database keys
      expect(result.current.storedDBs).toEqual(["db1", "db2", "db3"]);
    });

    // Ensure that getAllKeys is called with the correct arguments
    expect(indexedDBMock?.getAllKeys).toHaveBeenCalledWith("DBFiles");
  });

  test("should handle case when indexedDB is not provided", () => {
    // Render the hook without providing indexedDB context
    const { result } = renderHook(() => useGetUserDBs(undefined));

    // Ensure that storedDBs remains an empty array
    expect(result.current.storedDBs).toEqual([]);
  });
});
