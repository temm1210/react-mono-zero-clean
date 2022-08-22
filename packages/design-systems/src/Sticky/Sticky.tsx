import { useCallback, useState, useLayoutEffect, useMemo } from "react";
import { useClosetParent, useDeepCompareEffect, useEventListener } from "@project/react-hooks";
import { parentSelector } from "./utils";
import { useStyles } from "./hooks";
import StickyView, { StickyMode } from "./StickyView";
import { usePositionCalculators, useStatusUpdaters } from "./hooks/useStickyOperation";

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
  const [[setParent], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
    usePositionCalculators({
      top,
      bottom,
    });

  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  useDeepCompareEffect(() => {
    setParent(parentNode || document.body);
  }, [parentNode, setParent]);

  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters(!parentNode);

  const stickyModeMapper = useMemo(
    () => ({
      top: {
        isReachScreenToMode: () => calculatePositionHandlers().isReachScreenTop(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToTop(),
      },
      bottom: {
        isReachScreenToMode: () => calculatePositionHandlers().isReachScreenBottom(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToBottom(),
      },
    }),
    [calculatePositionHandlers],
  );

  const stickyMapper = stickyModeMapper[mode];

  // scroll event에 등록할 handler
  const update = useCallback(() => {
    const { isReachScreenToMode, isReachContainerBottomToMode } = stickyMapper;

    if (isReachScreenToMode()) {
      if (isReachContainerBottomToMode()) {
        return statusUpdaters?.stickToContainerBottom();
      }

      return statusUpdaters?.stickToScreenMode();
    }
    return statusUpdaters?.unStick();
  }, [statusUpdaters, stickyMapper]);

  useEventListener("scroll", update, { passive: true });
  useEventListener("resize", update);

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
    handleOnStickyStateUpdate(fakeRect.width, stickyRect.height, onStick);
  }, [fakeRect.width, handleOnStickyStateUpdate, onStick, stickyRect.height]);

  const handleOnUnSticky = useCallback(() => {
    handleOnStickyStateUpdate(fakeRect.width, 0, onUnStick);
  }, [fakeRect.width, handleOnStickyStateUpdate, onUnStick]);

  useLayoutEffect(() => {
    if (isSticky) {
      return handleOnSticky();
    }
    return handleOnUnSticky();
  }, [isSticky, handleOnUnSticky, handleOnSticky]);

  const { fakeStyle, stickyClassNames, calculateStickyStyle } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  const props = {
    mode,
    fakeRef,
    stickyRef,
    parentRef: findParentFrom,
    fakeStyle,
    stickyClassNames,
    calculateStickyStyle,
  };

  return <StickyView {...props}>{children}</StickyView>;
};

export default Sticky;
