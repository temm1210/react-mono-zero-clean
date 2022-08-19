import { render, screen } from "@testing-library/react";
import Slider from "../Slider";

describe("Slider component", () => {
  it("role이 slider인 tag가 존재한다.", () => {
    render(<Slider />);

    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("aria값이 주어진 property에 맞게 설정되어야 한다.", () => {
    render(<Slider min={0} max={100} defaultValue={50} />);

    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe(50);
    expect(slider.getAttribute("aria-valuemax")).toBe(100);
    expect(slider.getAttribute("aria-valuemin")).toBe(0);
  });
});
