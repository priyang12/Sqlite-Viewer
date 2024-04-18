import { renderHook, waitFor } from "@testing-library/react";
import initSqlJs from "sql.js";
import { useDefaultGetDB } from "../useDefaultGetDB";
import { Mock } from "vitest";

// Mocking fetch function
global.fetch = vi.fn().mockResolvedValue({
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
});

// Mocking sql.js
vi.mock("sql.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("useDefaultGetDB", () => {
  beforeEach(() => {
    // Reset the mock implementation for each test
    vi.clearAllMocks();
  });

  test("should initialize the database", async () => {
    // Mocking SQL constructor
    const mockSQLDatabase = {
      Database: vi.fn(),
    };

    (initSqlJs as unknown as Mock).mockResolvedValueOnce(mockSQLDatabase);

    // Rendering the hook
    const { result } = renderHook(() => useDefaultGetDB());

    // Asserting that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith("/database/seed.db");

    // Wait for the hook to finish initialization
    await waitFor(() => {
      // Asserting that SQL.js was initialized with the correct arguments
      expect(initSqlJs).toHaveBeenCalledWith({
        locateFile: expect.any(Function),
      });
    });

    // Asserting that SQL.Database constructor was called with the correct arguments
    expect(mockSQLDatabase.Database).toHaveBeenCalledWith(
      expect.any(Uint8Array)
    );

    // Asserting that the database is set in the state
    expect(result.current.db).toBeDefined();
  });

  test("should handle errors", async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation((message) => message);

    // Mocking error during database initialization
    (initSqlJs as unknown as Mock).mockRejectedValueOnce(
      new Error("Failed to initialize SQL.js")
    );

    // Rendering the hook
    const { result } = renderHook(() => useDefaultGetDB());

    // Wait for the hook to finish initialization
    await waitFor(() => {
      // Asserting that the error is logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        new Error("Failed to initialize SQL.js")
      );
    });

    // Asserting that the database is not set in the state
    expect(result.current.db).toBeUndefined();
  });
});
