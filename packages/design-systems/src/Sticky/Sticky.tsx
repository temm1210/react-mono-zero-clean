import { useState, useLayoutEffect, useRef } from "react";
import { useEventListener } from "@project/react-hooks";
import useStatusUpdaters from "./hooks/useStatusUpdaters";
import { StickyModeMapperRef } from "./interface";
import StickyByMode from "./Mode";

import "./Sticky.scss";

export type StickyModeType = "top" | "bottom";
export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;
export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

export interface Props {
  children: React.ReactNode;
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode?: StickyModeType;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top?: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom?: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: Callback;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: Callback;
}

interface StickyCallbackOnStatusRef {
  handleOnSticky: () => void;
  handleOnUnSticky: () => void;
}

const Sticky = ({ children, top = 0, bottom = 0, mode = "top", onStick, onUnStick }: Props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // 공통기능은 해당컴포넌트에서 구현
  // 공통기능이 아닌 mode마다 다른기능은 해당하는 자식컴포넌트에서 구현하는 용도
  // 자식컴포넌트에서는 StickyModeMapperRef interface의 요구사항을 반드시 모두 구현해야함
  const modeMapperRef = useRef<StickyModeMapperRef>(null);
  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters(!modeMapperRef.current?.parentNode);

  const handleOnSticky = () => {
    if (modeMapperRef.current) {
      const { fakeRect, stickyRect } = modeMapperRef.current;

      setWidth(fakeRect.width);
      setHeight(stickyRect.height);
      onStick?.({ width: fakeRect.width, height: stickyRect.height, top, bottom });
    }
  };

  const handleOnUnSticky = () => {
    if (modeMapperRef.current) {
      setWidth(modeMapperRef.current?.fakeRect.width);
      setHeight(0);
      onUnStick?.({ width: modeMapperRef.current?.fakeRect.width, height: 0, top, bottom });
    }
  };

  const callbacksOnStatusRef = useRef<StickyCallbackOnStatusRef>({
    handleOnSticky,
    handleOnUnSticky,
  });

  useLayoutEffect(() => {
    if (isSticky) {
      return callbacksOnStatusRef.current?.handleOnSticky();
    }
    return callbacksOnStatusRef.current?.handleOnUnSticky();
  }, [isSticky]);

  const update = () => {
    if (!modeMapperRef.current) return;

    const { isReachScreenToMode, isReachContainerBottomToMode } = modeMapperRef.current;

    if (isReachScreenToMode()) {
      if (isReachContainerBottomToMode()) {
        return statusUpdaters?.stickToContainerBottom();
      }
      return statusUpdaters?.stickToScreenMode();
    }
    return statusUpdaters?.unStick();
  };

  useEventListener("scroll", update, { passive: true });
  useEventListener("resize", update);

  return (
    <StickyByMode
      isAbsolute={isAbsolute}
      isSticky={isSticky}
      mode={mode}
      modeRef={modeMapperRef}
      top={top}
      bottom={bottom}
      width={width}
      height={height}
    >
      {children}
    </StickyByMode>
  );
};

export default Sticky;
