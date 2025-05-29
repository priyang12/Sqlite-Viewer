import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import BuilderComponent from "./BuilderComponent";

it("should render Component", () => {
  render(<BuilderComponent query="" setQuery={() => {}} runQueryBtn={null} />);
});
