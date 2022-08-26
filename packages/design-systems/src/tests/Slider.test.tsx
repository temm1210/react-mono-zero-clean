import { render, screen, fireEvent } from "@testing-library/react";
import Slider from "../Slider";

describe("Slider component test", () => {
  it("role이 slider인 tag가 존재한다.", () => {
    render(<Slider />);

    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("aria값이 주어진 property에 맞게 설정되어야 한다.", () => {
    const min = 10;
    const max = 200;
    const defaultValue = 30;

    render(<Slider min={min} max={max} defaultValue={defaultValue} />);

    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe(`${defaultValue}`);
    expect(slider.getAttribute("aria-valuemax")).toBe(`${max}`);
    expect(slider.getAttribute("aria-valuemin")).toBe(`${min}`);
  });

  it("slider controller이 draggable이여야 하고 drag가 끝나는 지점에서의 값으로 value가 설정되어야한다.", async () => {
    render(<Slider />);

    const sliderController = screen.getByRole("slider");

    fireEvent.mouseDown(sliderController);
    fireEvent.mouseMove(sliderController, { clientX: 100 });
    fireEvent.mouseUp(sliderController);

    expect(sliderController).toHaveAttribute("aria-valuenow", "20");
  });
});
