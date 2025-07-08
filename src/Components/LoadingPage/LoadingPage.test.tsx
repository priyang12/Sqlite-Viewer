import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LoadingPage from "./LoadingPage";

it("should render Component", () => {
  render(<LoadingPage />);
});
