import Skeleton from "./Skeleton";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

describe("Skeleton Component", () => {
  test("renders the correct number of skeletons", () => {
    const { container } = render(<Skeleton count={3} />);
    const skeletons = container.getElementsByClassName("skeleton");
    expect(skeletons.length).toBe(3);
  });

  test("applies the correct width and height", () => {
    const { container } = render(<Skeleton width="100px" height="200px" />);
    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toHaveStyle("width: 100px");
    expect(skeleton).toHaveStyle("height: 200px");
  });

  test("applies custom styles correctly", () => {
    const customStyle = { backgroundColor: "red", borderRadius: "5px" };
    const { container } = render(<Skeleton style={customStyle} />);
    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toHaveStyle("background-color: rgb(255, 0, 0);");
    expect(skeleton).toHaveStyle("border-radius: 5px");
  });

  test("applies additional class names correctly", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toHaveClass("custom-class");
  });
});
