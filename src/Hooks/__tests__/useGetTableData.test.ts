import { renderHook, waitFor } from "@testing-library/react";
import { useGetTableData } from "../useGetTableData";
import { useGetDBContext } from "../../Context/DBContext";
import { Mock } from "vitest";

vi.mock("../../Context/DBContext", () => ({
  useGetDBContext: vi.fn().mockReturnValue({
    db: {
      exec: vi.fn().mockReturnValue([
        {
          columns: ["id", "name"],
          values: [
            [1, "technology"],
            [2, "science"],
          ],
        },
      ]),
    },
  }),
}));

describe("useGetTableData Hook", () => {
  it("fetches data from the database and sets loading to true while fetching", () => {
    const query = "SELECT * FROM table";
    const { result } = renderHook(() => useGetTableData(query));

    expect(result.current.loading).toBe(true);
  });

  it("fetches data from the database and sets row and columns", async () => {
    const query = "SELECT * FROM table";
    const { result } = renderHook(() => useGetTableData(query));

    await waitFor(() => {
      expect(result.current.columns).toEqual(["id", "name"]);
      expect(result.current.row).toEqual([
        [1, "technology"],
        [2, "science"],
      ]);
    });
  });

  it("handles errors gracefully", async () => {
    const query = "SELECT * FROM table";

    (useGetDBContext as Mock).mockReturnValue({
      db: {
        exec: vi.fn().mockImplementation(() => {
          throw new Error("Database error");
        }),
      },
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation((message) => message);

    // Rendering the hook
    const { result } = renderHook(() => useGetTableData(query));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Database error"));
      expect(result.current.columns).toBeUndefined();
      expect(result.current.row).toBeUndefined();
    });
  });
});
