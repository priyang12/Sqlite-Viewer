import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import BuilderComponent from "./BuilderComponent";
import { Database } from "sql.js";

it("should render Component", () => {
  render(
    <BuilderComponent
      query=""
      setQuery={() => {}}
      db={undefined as unknown as Database}
    />,
  );
});
