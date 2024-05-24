import { renderHook, waitFor } from "@testing-library/react";
import { useGetSubStrQuery } from "../useGetSubStrQuery";

vi.mock("../useDefaultGetDB", () => ({
  useDefaultGetDB: vi.fn().mockReturnValue({
    db: {
      exec: vi.fn().mockReturnValue([
        {
          columns: ["query"],
          values: [
            ["SELECT substr(id, 1, 100) AS id,substr(name, 1, 100) AS name"],
          ],
        },
      ]),
    },
  }),
}));

describe("useGetSubStrQuery Hook", () => {
  it("fetches data from the database and sets loading to true while fetching", () => {
    const tableName = "table";
    const { result } = renderHook(() => useGetSubStrQuery(tableName));

    expect(result.current.loading).toBe(true);
  });

  it("fetches data from the database and sets the querySubstr", async () => {
    const tableName = "table";
    const { result } = renderHook(() => useGetSubStrQuery(tableName));

    await waitFor(() => {
      expect(result.current.querySubstr).toEqual(
        "SELECT substr(id, 1, 100) AS id,substr(name, 1, 100) AS name FROM table;",
      );
    });
  });
});
