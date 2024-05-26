import { renderHook, waitFor } from "@testing-library/react";
import useSqlQueries from "../useSqlQueries"; // Adjust the import path as needed
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

describe("useSqlQueries Hook", () => {
  it("fetches data from the database and sets loading to true while fetching", () => {
    const queries = ["SELECT * FROM table1", "SELECT * FROM table2"];
    const { result } = renderHook(() => useSqlQueries(queries));

    expect(result.current.loading).toBe(true);
  });

  it("fetches data from the database and sets rows and columns", async () => {
    const queries = ["SELECT * FROM table1", "SELECT * FROM table2"];
    const { result } = renderHook(() => useSqlQueries(queries));

    await waitFor(() => {
      expect(result.current.results).toEqual([
        [
          {
            columns: ["id", "name"],
            values: [
              [1, "technology"],
              [2, "science"],
            ],
          },
        ],
        [
          {
            columns: ["id", "name"],
            values: [
              [1, "technology"],
              [2, "science"],
            ],
          },
        ],
      ]);
    });
  });

  it("handles errors gracefully", async () => {
    const queries = ["SELECT * FROM table1", "SELECT * FROM table2"];

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
    const { result } = renderHook(() => useSqlQueries(queries));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Database error"));
      expect(result.current.results).toHaveLength(0);
    });
  });
});
