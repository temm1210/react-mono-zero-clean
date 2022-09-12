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

  it("mode = horizontal일 때 style과 value가 맞게 변화해야한다.", () => {
    const max = 200;
    const min = 10;
    let step = 1;

    const { container, getByRole, rerender } = render(<Slider min={min} max={max} step={step} />);

    const sliderContainer = container.getElementsByClassName("slider")[0];
    const controller = getByRole("slider");
    const sliderTrack = container.getElementsByClassName("slider__track")[0];

    const left = 40;
    const width = 300;

    sliderContainer.getBoundingClientRect = jest.fn(() => {
      return {
        width,
        height: 10,
        top: 0,
        left,
        bottom: 0,
        right: 0,
      } as DOMRect;
    });

    // minxClientX <= clientX <= maxClientX
    const maxClientX = width + left;
    const minxClientX = left;

    // 초기 값
    expect(controller).toHaveAttribute("aria-valuenow", "10");
    expect(controller).toHaveStyle("left:0%");
    expect(sliderTrack).toHaveStyle("width:0%");

    // controller를 rail의 특정 부분에 click시
    fireEvent.mouseDown(controller, { clientX: 200 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "111");
    expect(controller).toHaveStyle("left:53%");
    expect(sliderTrack).toHaveStyle("width:53%");

    // controller를 start지점으로 drag시
    fireEvent.mouseDown(controller, { clientX: 150 });
    fireEvent.mouseMove(controller, { clientX: minxClientX });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "10");
    expect(controller).toHaveStyle("left:0%");
    expect(sliderTrack).toHaveStyle("width:0%");

    // controller를 rail의 특정(min < rail < max) 부분에 drag시
    fireEvent.mouseDown(controller, { clientX: 0 });
    fireEvent.mouseMove(controller, { clientX: 150 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "79");
    expect(controller).toHaveStyle("left:36%");
    expect(sliderTrack).toHaveStyle("width:36%");

    // controller를 끝까지 drag시
    fireEvent.mouseDown(controller, { clientX: 0 });
    fireEvent.mouseMove(controller, { clientX: maxClientX });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "200");
    expect(controller).toHaveStyle("left:100%");
    expect(sliderTrack).toHaveStyle("width:100%");

    step = 20;
    rerender(<Slider step={step} min={min} max={max} />);

    fireEvent.mouseDown(controller, { clientX: left });
    fireEvent.mouseMove(controller, { clientX: left + 10 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "10");
    expect(controller).toHaveStyle("left:0%");
    expect(sliderTrack).toHaveStyle("width:0%");

    fireEvent.mouseDown(controller, { clientX: left });
    fireEvent.mouseMove(controller, { clientX: left + 18 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "30");
    expect(controller).toHaveStyle("left:10%");
    expect(sliderTrack).toHaveStyle("width:10%");

    step = 35;
    rerender(<Slider step={step} min={min} max={max} />);

    fireEvent.mouseDown(controller, { clientX: left });
    fireEvent.mouseMove(controller, { clientX: left + step });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "45");
    expect(controller).toHaveStyle("left:18%");
    expect(sliderTrack).toHaveStyle("width:18%");

    fireEvent.mouseDown(controller, { clientX: left });
    fireEvent.mouseMove(controller, { clientX: maxClientX });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "200");
    expect(controller).toHaveStyle("left:100%");
    expect(sliderTrack).toHaveStyle("width:100%");
  });
  it("mode = vertical일 때 style과 value가 맞게 변화해야한다.", () => {
    const max = 205;
    const min = 10;
    let step = 1;

    const { container, getByRole, rerender } = render(<Slider min={min} max={max} step={step} />);

    const sliderContainer = container.getElementsByClassName("slider")[0];
    const controller = getByRole("slider");
    const sliderTrack = container.getElementsByClassName("slider__track")[0];

    const height = 300;
    const bottom = height;

    sliderContainer.getBoundingClientRect = jest.fn(() => {
      return {
        width: 10,
        height,
        top: 0,
        left: 0,
        bottom,
        right: 0,
      } as DOMRect;
    });

    step = 15;
    rerender(<Slider min={min} max={max} step={step} orientation="vertical" />);

    // 초기값
    expect(controller).toHaveAttribute("aria-valuenow", "10");
    expect(controller).toHaveStyle("bottom:0%");
    expect(sliderTrack).toHaveStyle("height:0%");

    fireEvent.mouseDown(controller, { clientY: 0 });
    fireEvent.mouseMove(controller, { clientY: 280 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "25");
    expect(controller).toHaveStyle("bottom:7%");
    expect(sliderTrack).toHaveStyle("height:7%");

    fireEvent.mouseDown(controller, { clientY: 0 });
    fireEvent.mouseMove(controller, { clientY: 250 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "40");
    expect(controller).toHaveStyle("bottom:15%");
    expect(sliderTrack).toHaveStyle("height:15%");

    fireEvent.mouseDown(controller, { clientY: 0 });
    fireEvent.mouseMove(controller, { clientY: 200 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "70");
    expect(controller).toHaveStyle("bottom:30%");
    expect(sliderTrack).toHaveStyle("height:30%");

    fireEvent.mouseDown(controller, { clientY: 0 });
    fireEvent.mouseMove(controller, { clientY: 0 });
    fireEvent.mouseUp(controller);

    expect(controller).toHaveAttribute("aria-valuenow", "205");
    expect(controller).toHaveStyle("bottom:100%");
    expect(sliderTrack).toHaveStyle("height:100%");
  });

  it("max <= min일시 error를 발생시킨다.", () => {
    expect(() => render(<Slider min={200} max={100} />)).toThrowError("'max prop' must be greater than 'min prop'");
    expect(() => render(<Slider min={200} max={200} />)).toThrowError("'max prop' must be greater than 'min prop'");
  });

  it("defaultValue < min, defaultValue > max일시 error를 발생시킨다.", () => {
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
  it("slider의 container padding = controller height - container height 이여야 한다.", () => {
    const railSize = 20;
    const controllerSize = 50;

    const { container, rerender } = render(
      <Slider
        min={30}
        max={100}
        defaultValue={50}
        step={15}
        controllerSize={controllerSize}
        orientation="horizontal"
        railSize={railSize}
      />,
    );

    const sliderContainer = container.getElementsByClassName("slider")[0];

    expect(sliderContainer).toHaveStyle("height:20px");
    expect(sliderContainer).toHaveStyle("padding:15px 0");

    rerender(
      <Slider
        min={30}
        max={100}
        defaultValue={50}
        step={15}
        controllerSize={controllerSize}
        orientation="vertical"
        railSize={railSize}
      />,
    );

    expect(sliderContainer).toHaveStyle("width:20px");
    expect(sliderContainer).toHaveStyle("padding:0 15px");
  });
  it("slider의 props에 onChange가 존재할 시, slider의 value가 변할때마다 호출되어야한다.", () => {
    const onChange = jest.fn();

    const min = 50;
    const max = 250;
    const step = 25;
    const { container, getByRole } = render(<Slider min={min} max={max} onChange={onChange} step={step} />);

    // 마운트된 이후 한번호출
    expect(onChange).toHaveBeenCalledTimes(1);

    onChange.mockClear();

    const sliderContainer = container.getElementsByClassName("slider")[0];

    const left = 20;
    const width = 350;

    const minxClientX = left;

    sliderContainer.getBoundingClientRect = jest.fn(() => {
      return {
        width,
        height: 10,
        top: 0,
        left,
        bottom: 0,
        right: 0,
      } as DOMRect;
    });

    const controller = getByRole("slider");

    // rail의 특정부분을 클릭했을때
    fireEvent.mouseDown(controller, { clientX: minxClientX + 120 });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(min + step * 3);

    onChange.mockClear();

    // value에 변화가 없을때
    fireEvent.mouseDown(controller, { clientX: minxClientX });
    fireEvent.mouseUp(controller);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(min);

    // mouse를 drag하면서 value를 변화시킬때
    fireEvent.mouseDown(controller, { clientX: minxClientX });
    fireEvent.mouseMove(controller, { clientX: minxClientX + 40 });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(min + step);

    fireEvent.mouseMove(controller, { clientX: minxClientX + 80 });
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith(min + step * 2);

    fireEvent.mouseMove(controller, { clientX: minxClientX + 120 });
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenLastCalledWith(min + step * 3);

    fireEvent.mouseMove(controller, { clientX: minxClientX + 160 });
    fireEvent.mouseUp(controller);
    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenLastCalledWith(min + step * 4);
  });
});
