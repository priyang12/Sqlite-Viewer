import { useState, useEffect } from "react";

/**
 * useDark is a custom hook that detects the dark mode preference of the user.
 * @returns {boolean} - Returns a boolean indicating whether the dark mode is enabled.
 * @example
 * // Example usage:
 * const { isDarkMode } = useDark();
 */
const useDark = (): { isDarkMode: boolean } => {
  // State variable to hold the dark mode status
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    // Initialize with the result of the dark mode media query
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    // Event listener callback for dark mode changes
    const darkModeListener = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches); // Update the dark mode status
    };

    // Media query for dark mode preference
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Add event listener for changes in dark mode preference
    darkModeMediaQuery.addEventListener("change", darkModeListener);

    // Clean up function to remove event listener
    return () => {
      darkModeMediaQuery.removeEventListener("change", darkModeListener);
    };
  }, []);

  return { isDarkMode };
};

export default useDark;
