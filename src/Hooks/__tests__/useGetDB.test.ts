import { renderHook, waitFor } from "@testing-library/react";
import { useGetDB } from "../useGetDB";
import { Mock } from "vitest";
import initSqlJs from "sql.js";

// Mocking fetch function
global.fetch = vi.fn().mockResolvedValue({
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
});

// Mocking sql.js
vi.mock("sql.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("useGetDB", () => {
  beforeEach(() => {
    // Reset the mock implementation for each test
    vi.clearAllMocks();
  });

  test("should initialize the database when file is provided", async () => {
    // Mock file object
    const mockFile = new File(["dummy content"], "dummy.db");

    // Mock arrayBuffer method of file object
    mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0));

    // Mocking SQL constructor
    const mockSQLDatabase = {
      Database: vi.fn(),
    };

    (initSqlJs as unknown as Mock).mockResolvedValueOnce(mockSQLDatabase);

    // Rendering the hook
    const { result } = renderHook(() => useGetDB(mockFile));

    // Wait for the hook to finish initialization
    await waitFor(() => {
      // Asserting that SQL.js was initialized with the correct arguments
      expect(initSqlJs).toHaveBeenCalledWith({
        locateFile: expect.any(Function),
      });
    });

    // Asserting that arrayBuffer method of file object is called
    expect(mockFile.arrayBuffer).toHaveBeenCalled();

    // Asserting that SQL.Database constructor was called with the correct arguments
    expect(mockSQLDatabase.Database).toHaveBeenCalledWith(
      expect.any(Uint8Array)
    );

    // Asserting that the database is set in the state
    expect(result.current.db).toBeDefined();
  });

  test("should handle errors", async () => {
    // Mock file object
    const mockFile = new File(["dummy content"], "dummy.db");

    // Mock arrayBuffer method of file object to throw an error
    mockFile.arrayBuffer = vi
      .fn()
      .mockRejectedValue(new Error("Failed to read file"));

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation((message) => message);

    // Rendering the hook
    const { result } = renderHook(() => useGetDB(mockFile));

    // Wait for the hook to finish initialization
    await waitFor(() => {
      // Asserting that the error is logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        new Error("Failed to read file")
      );
    });

    // Asserting that the database is not set in the state
    expect(result.current.db).toBeUndefined();
  });

  test("should not load database when file is not provided", async () => {
    // Rendering the hook without providing a file
    const { result } = renderHook(() => useGetDB(null));

    // Asserting that the database is not set in the state
    expect(result.current.db).toBeUndefined();
  });
});
