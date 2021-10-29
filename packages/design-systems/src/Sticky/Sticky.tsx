import { RefObject, useCallback, useLayoutEffect, useRef, useState } from "react";
import { useEvent, useClosetParent } from "@project/react-hooks";
import { StickyMode } from "./types";
import { parentSelector } from "./utils";
import { usePositionUpdate, useStatusUpdate, useStyles, useUpdateStrategy } from "./hooks";
import "./Sticky.scss";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

export interface Props {
  children: React.ReactNode;
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode?: StickyMode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top?: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom?: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: Callback;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: Callback;
}

const Sticky = ({ children, top = 0, bottom = 0, mode = "top", onStick, onUnStick }: Props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const fakeRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  const handleOnStick = useCallback(() => {
    onStick?.({ width, height, top, bottom });
  }, [width, height, top, bottom, onStick]);

  const handleUnStick = useCallback(() => {
    onUnStick?.({ width, height, top, bottom });
  }, [width, height, top, bottom, onUnStick]);

  // 현재 엘리먼트의 상태값을 계산하는 handler
  const [statusUpdateHandlers, { isSticky, isAbsolute }] = useStatusUpdate(!parentNode, {
    onStick: handleOnStick,
    onUnStick: handleUnStick,
  });

  // scroll 위치에 따라 현재 엘리먼트의 위치값을 계산하는 handler
  const positionUpdateHandlers = usePositionUpdate(parentNode || document.body, fakeRef.current, stickyRef.current, {
    top,
    bottom,
  });

  // mode에따라 다른 update 함수를 return
  const updateHandler = useUpdateStrategy(mode, { statusUpdateHandlers, positionUpdateHandlers });

  const update = useCallback(() => {
    if (!updateHandler) return;
    updateHandler();
  }, [updateHandler]);

  const getRect = (ref: RefObject<Element | null>) => {
    return ref.current?.getBoundingClientRect();
  };

  // sticky상태에 따라 할 일 정의
  // paint전 스타일계산을 진행후 적용
  useLayoutEffect(() => {
    const stickyRect = getRect(stickyRef);
    const fakeRect = getRect(fakeRef);
    if (!stickyRect || !fakeRect) return;

    const { height: lHeight } = stickyRect;
    const { width: lWidth } = fakeRect;

    if (isSticky) setHeight(lHeight);
    else setHeight(0);

    setWidth(lWidth);
  }, [isSticky]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  const { fakeStyle, stickyClassNames, calculateStickyStyle } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      {/* fake element */}
      {mode === "top" && <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />}
      <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
        {children}
      </div>
      {/* fake element */}
      {mode === "bottom" && <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />}
    </div>
  );
};

export default Sticky;
