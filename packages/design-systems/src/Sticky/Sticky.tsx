import { useCallback, useState, useLayoutEffect, useRef } from "react";
import { useEventListener } from "@project/react-hooks";
import useStatusUpdaters from "./hooks/useStatusUpdaters";
import useStyles from "./hooks/useStyles";

import "./Sticky.scss";
import { StickyModeMapperRef } from "./types";
import TopSticky from "./TopSticky";

export type StickyMode = "top" | "bottom";
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

  const modeMapperRef = useRef<StickyModeMapperRef>(null);
  // const [[setParent], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
  //   usePositionCalculators({
  //     top,
  //     bottom,
  //   });

  // const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  // useDeepCompareEffect(() => {
  //   setParent(parentNode || document.body);
  // }, [parentNode, setParent]);

  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters(!modeMapperRef.current?.parentNode);
  console.log("modeMapperRef.current?.parentNode:", modeMapperRef.current?.parentNode);

  // sticky status state가 변할 때 실행할 callback
  const handleOnStickyStateUpdate = useCallback(
    (pWidth: number, pHeight: number, callback?: Callback) => {
      const rect = { width: pWidth, height: pHeight, top, bottom };

      setWidth(pWidth);
      setHeight(pHeight);
      callback?.(rect);
    },
    [bottom, top],
  );

  const handleOnSticky = useCallback(() => {
    if (modeMapperRef.current) {
      const { fakeRect, stickyRect } = modeMapperRef.current;
      handleOnStickyStateUpdate(fakeRect.width, stickyRect.height, onStick);
    }
  }, [handleOnStickyStateUpdate, onStick]);

  const handleOnUnSticky = useCallback(() => {
    if (modeMapperRef.current) {
      handleOnStickyStateUpdate(modeMapperRef.current?.fakeRect.width, 0, onUnStick);
    }
  }, [handleOnStickyStateUpdate, onUnStick]);

  useLayoutEffect(() => {
    if (isSticky) {
      return handleOnSticky();
    }
    return handleOnUnSticky();
  }, [isSticky, handleOnUnSticky, handleOnSticky]);

  // useUpdate({ mode, positionHandlers: calculatePositionHandlers, statusUpdaters });

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

  const { fakeStyle, stickyClassNames, calculateStickyStyle } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  // const props = {
  //   mode,
  //   fakeRef,
  //   stickyRef,
  //   parentRef: findParentFrom,
  //   fakeStyle,
  //   stickyClassNames,
  //   calculateStickyStyle,
  // };

  return (
    <TopSticky
      ref={modeMapperRef}
      top={top}
      fakeStyle={fakeStyle}
      calculateStickyStyle={calculateStickyStyle}
      stickyClassNames={stickyClassNames}
    >
      {children}
    </TopSticky>
  );
};

export default Sticky;
