import { renderHook, waitFor } from "@testing-library/react";
import { useGetData } from "../useGetData";

// need to fix mocking.

let mockT = vi.fn().mockImplementation((query) => {
  return [
    {
      columns: ["id", "name"],
      values: [
        [1, "John"],
        [2, "Doe"],
      ],
    },
  ];
});

vi.mock("../useGetDBContext", () => ({
  useGetDBContext: () => ({
    db: {
      exec: mockT,
    },
  }),
}));

describe.skip("useGetData", () => {
  test("fetches data from SQLite database", async () => {
    // Mock the useGetDBContext hook to return a mocked database object

    // Render the hook with a sample query
    const { result } = renderHook(() => useGetData("SELECT * FROMr uses"));

    // Act
    // await waitFor(() => {
    //   // Verify loading state becomes true
    //   expect(result.current.loading).toBe(true);
    // });

    // await act(async () => {
    //   // Verify fetched data
    //   expect(result.current.row).toEqual([
    //     [1, "John"],
    //     [2, "Doe"],
    //   ]);
    // });

    await waitFor(() => {
      expect(result.current.columns).toEqual(["id", "name"]);
    });
    // expect(result.current.loading).toBe(false);
  });
});
