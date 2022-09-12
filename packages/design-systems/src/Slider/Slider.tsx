import { useRect } from "@project/react-hooks";
import { convertHexToRGBA } from "@project/utils";
import React, { useEffect, useState } from "react";
import { useValidation, UseValidationProps } from "./hooks";

import "./Slider.scss";

export type SliderOnChange = (value: number) => void;
export type SliderOrientation = "horizontal" | "vertical";
export interface SliderProps {
  /** 도달할 수 있는 최소값 */
  min?: UseValidationProps["min"];
  /** 도달할 수 있는 최대값 */
  max?: UseValidationProps["max"];
  /** 초기값 */
  defaultValue?: UseValidationProps["defaultValue"];
  /** 증가나 감소시킬 값의 크기 */
  step?: number;
  /** slider controller의 크기(정사각형) */
  controllerSize?: number;
  /** slider rail의 크기(track도 같이적용) */
  railSize?: number;
  /** slider의 크기(horizontal일때는 width, vertical일때는 height로 적용됨) */
  size?: string;
  /** slider track의 color */
  trackColor?: string;
  /** slider의 방향(horizontal,vertical) */
  orientation?: SliderOrientation;
  /** slider의 value가 변경될 때 실행할 callback 함수 */
  onChange?: SliderOnChange;
}

// TODO: orientation에 따른 코드분리
// TODO: style분리 확인
function Slider({
  min = 0,
  max = 100,
  defaultValue = min || 0,
  step = 1,
  controllerSize = 20,
  railSize = 6,
  size,
  trackColor = "#19ce60",
  orientation = "horizontal",
  onChange,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [setSliderElement, sliderElementRect] = useRect();
  const [value, setValue] = useState(Math.max(min, defaultValue));

  // validation성공시 값을 업데이트하는 함수
  // update시 필요한 validation은 해당 함수에 모두 작성
  const updateValueOnCondition = (_value: number) => {
    if (_value > max || _value < min) return;

    if (_value === max) return setValue(max);
    if (_value === min) return setValue(min);

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

    if (orientation === "horizontal") {
      const { width, left } = sliderElementRect();
      updateValueOnCondition(calculateNextValue(event.clientX - left, width));
    } else {
      const { height, bottom } = sliderElementRect();
      updateValueOnCondition(calculateNextValue(bottom - event.clientY, height));
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    event.preventDefault();

    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);

    setIsDragging(false);
  };

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onMouseUp);

    if (orientation === "horizontal") {
      const { width, left } = sliderElementRect();
      updateValueOnCondition(calculateNextValue(event.clientX - left, width));
    } else {
      const { height, bottom } = sliderElementRect();
      updateValueOnCondition(calculateNextValue(bottom - event.clientY, height));
    }

    setIsDragging(true);
  };

  useEffect(() => {
    onChange?.(value);
  }, [onChange, value]);

  useValidation({ max, min, defaultValue });

  const railRectStyles =
    orientation === "horizontal"
      ? { height: `${railSize}px`, width: "100%", top: "50%", transform: "translateY(-50%)" }
      : { width: `${railSize}px`, height: "100%", left: "50%", transform: "translateX(-50%)" };
  const railStyles = {
    ...railRectStyles,
  };

  const trackRectStyles =
    orientation === "horizontal"
      ? {
          width: convertToPercent(value),
          height: `${railSize}px`,
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
        }
      : {
          width: `${railSize}px`,
          height: convertToPercent(value),
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        };
  const trackStyles = {
    backgroundColor: trackColor,
    ...trackRectStyles,
  };

  const controllerOrientationStyles =
    orientation === "horizontal"
      ? { left: convertToPercent(value), transform: "translateX(-50%)", top: 0 }
      : { bottom: convertToPercent(value), transform: "translateY(50%)", left: 0 };
  const controllerStyles = {
    width: `${controllerSize}px`,
    boxShadow: isDragging ? `0px 0px 0px 8px ${convertHexToRGBA(trackColor, 10)}` : undefined,
    border: `2px solid ${trackColor}`,
    height: `${controllerSize}px`,
    ...controllerOrientationStyles,
  };

  const sliderRectStyles =
    orientation === "horizontal"
      ? { height: `${railSize}px`, padding: `${(controllerSize - railSize) / 2}px 0`, width: size || "100%" }
      : { height: size || "300px", width: `${railSize}px`, padding: `0 ${(controllerSize - railSize) / 2}px` };
  const sliderStyles = {
    ...sliderRectStyles,
  };

  return (
    <div className="slider" onMouseDown={onMouseDown} style={sliderStyles} ref={setSliderElement}>
      <div className="slider__rail" style={railStyles} />
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
