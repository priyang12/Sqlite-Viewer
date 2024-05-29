import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import IconComponent from "./IconComponent";

describe("IconComponent Component", () => {
  it("renders INTEGER icon with correct aria-label", () => {
    render(<IconComponent IconType="INTEGER" />);
    const icon = screen.getByRole("img", { name: "integer icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "integer icon");
  });

  it("renders TEXT icon with correct aria-label", () => {
    render(<IconComponent IconType="TEXT" />);
    const icon = screen.getByRole("img", { name: "text icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "text icon");
  });

  it("renders DATETIME icon with correct aria-label", () => {
    render(<IconComponent IconType="DATETIME" />);
    const icon = screen.getByRole("img", { name: "datetime icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "datetime icon");
  });

  it("renders pinDown icon with correct aria-label", () => {
    render(<IconComponent IconType="pinDown" />);
    const icon = screen.getByRole("img", { name: "pin down icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "pin down icon");
  });

  it("renders pinUp icon with correct aria-label", () => {
    render(<IconComponent IconType="pinUp" />);
    const icon = screen.getByRole("img", { name: "pin up icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "pin up icon");
  });

  it("renders none icon with correct aria-label", () => {
    render(<IconComponent IconType="none" />);
    const icon = screen.getByRole("img", { name: "none icon" });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "none icon");
  });
});
