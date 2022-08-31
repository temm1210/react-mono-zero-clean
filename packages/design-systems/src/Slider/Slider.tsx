import { useRect } from "@project/react-hooks";
import React, { useState } from "react";
import { useValidation, UseValidationProps } from "./hooks";

import "./Slider.scss";

export interface SliderProps {
  /** 도달할 수 있는 최소값 */
  min?: UseValidationProps["min"];
  /** 도달할 수 있는 최대값 */
  max?: UseValidationProps["max"];
  /** 초기값 */
  defaultValue?: UseValidationProps["defaultValue"];
  /** 증가나 감소시킬 값의 크기 */
  step?: number;
}

function Slider({ min = 50, max = 250, defaultValue = min || 0, step = 20 }: SliderProps) {
  const [setSliderElement, sliderElementRect] = useRect();
  const [value, setValue] = useState(Math.max(min, defaultValue));

  // validation성공시 값을 업데이트하는 함수
  // update시 필요한 validation은 해당 함수에 모두 작성
  const updateValueOnCondition = (_value: number) => {
    if (_value > max || _value < min) return;

    const nextValue = min + Math.round((_value - min) / step) * step;

    setValue(nextValue);
  };

  // slider value값 계산담당
  const calculateNextValue = (distance: number, denominator: number) => {
    return Math.floor((distance * (max - min)) / denominator + min);
  };

  const convertToPercent = (_value: number) => {
    return `${Math.floor(((_value - min) * 100) / (max - min))}%`;
  };

  const onMove = (event: MouseEvent) => {
    event.preventDefault();

    const { width, left } = sliderElementRect();
    updateValueOnCondition(calculateNextValue(event.clientX - left, width));
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

    const { width, left } = sliderElementRect();
    updateValueOnCondition(calculateNextValue(event.clientX - left, width));
  };

  const trackStyles = {
    width: convertToPercent(value),
  };

  const controllerStyles = {
    left: convertToPercent(value),
  };

  useValidation({ max, min, defaultValue });

  console.log(value);

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
