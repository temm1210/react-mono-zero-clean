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

  it("drag가 끝나는 지점에서의 값(style, value)이 올바르게 계산되어야한다.", () => {
    const { container, getByRole } = render(<Slider min={10} max={200} defaultValue={10} />);

    const sliderContainer = container.getElementsByClassName("slider")[0];

    sliderContainer.getBoundingClientRect = jest.fn(() => {
      return {
        width: 300,
        height: 10,
        top: 0,
        left: 20,
        bottom: 0,
        right: 0,
      } as DOMRect;
    });

    const sliderController = getByRole("slider");

    fireEvent.mouseDown(sliderController);
    fireEvent.mouseMove(sliderController, { clientX: 100 });
    fireEvent.mouseUp(sliderController);

    expect(sliderController).toHaveAttribute("aria-valuenow", `${60}`);
    expect(sliderController).toHaveStyle(`left:26%`);

    const sliderTack = container.getElementsByClassName("slider__track")[0];
    expect(sliderTack).toHaveStyle(`width:26%`);
  });

  it("max <= min 일시 error를 발생시킨다.", () => {
    expect(() => render(<Slider min={200} max={100} />)).toThrowError("'max prop' must be greater than 'min prop'");
    expect(() => render(<Slider min={200} max={200} />)).toThrowError("'max prop' must be greater than 'min prop'");
  });

  it("defaultValue >= min, defaultValue <=max 이어야 한다.", () => {
    // defaultValue validation전에 max, min먼저 validation 확인
    expect(() => render(<Slider min={200} max={100} defaultValue={100} />)).toThrowError(
      "'max prop' must be greater than 'min prop'",
    );

    expect(() => render(<Slider min={100} max={300} defaultValue={50} />)).toThrowError(
      "'defaultValue prop' must be equal or greater than 'min prop'",
    );

    // 모든 validation 통과시에는 error를 던지면안됨
    expect(() => render(<Slider min={100} max={300} defaultValue={100} />)).not.toThrowError();
  });
});
