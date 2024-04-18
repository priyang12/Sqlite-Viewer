import { renderHook } from "@testing-library/react";
import useDark from "../useDark";

describe("useDark Hook", () => {
  test("should be false by default (light mode)", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    const { result } = renderHook(() => useDark());

    expect(result.current.isDarkMode).toBeFalsy();
  });

  test("should switch to dark mode when prefers-color-scheme is dark", () => {
    // Mocking matchMedia to return dark mode preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Re-render the hook with the mocked matchMedia
    const { result } = renderHook(() => useDark());

    // Assert that dark mode is enabled
    expect(result.current.isDarkMode).toBeTruthy();
  });
});
