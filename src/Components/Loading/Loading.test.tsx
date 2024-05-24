import { render } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("Test loading style using snapshot", () => {
    const result = render(<Loading />);
    expect(result).toMatchSnapshot();
  });
});
