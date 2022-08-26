import { useRect } from "@project/react-hooks";
import React, { useState } from "react";

import "./Slider.scss";

export interface SliderProps {
  /** 도달할 수 있는 최소값 */
  min?: number;
  /** 도달할 수 있는 최대값 */
  max?: number;
  /** 초기값 */
  defaultValue?: number;
}

function Slider({ min = 0, max = 100, defaultValue = 0 }: SliderProps) {
  const [setSliderElement, sliderElementRect] = useRect();

  const [value, setValue] = useState(defaultValue);

  const calculateNextValue = (xPosition: number) => {
    const { width, left } = sliderElementRect();

    const moveDistance = xPosition - left;

    const nextValue = Math.floor((moveDistance * 100) / width);

    if (nextValue > 100 || nextValue < 0) return;
    return nextValue;
  };

  const onMove = (event: MouseEvent) => {
    event.preventDefault();

    const nextValue = calculateNextValue(event.clientX);

    if (nextValue) setValue(nextValue);
  };

  const onMouseUp = (event: MouseEvent) => {
    event.preventDefault();

    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onMouseUp);

    const nextValue = calculateNextValue(event.clientX);

    if (nextValue) setValue(nextValue);
  };

  const trackStyles = {
    width: `${value}%`,
  };

  const controllerStyles = {
    left: `${value}%`,
  };

  console.log("value:", value);
  return (
    <div className="slider" onMouseDown={onMouseDown} ref={setSliderElement}>
      <div className="slider__rail" />
      <div className="slider__track" style={trackStyles} />
      <div
        style={controllerStyles}
        className="slider__controller"
        role="slider"
        aria-label="가로방향 슬라이더"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-orientation="horizontal"
        tabIndex={0}
      />
    </div>
  );
}

export default Slider;
