import { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { useClosetParent } from "@project/react-hooks";
import { parentSelector } from "./utils";
import { useStyles, useStickyOperation } from "./hooks";
import StickyView, { StickyMode } from "./StickyView";
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
  const [[setParentRef], [stickyRef, stickyRect], [fakeRef, fakeRect], { isSticky, isAbsolute }] = useStickyOperation({
    mode,
    top,
    bottom,
  });

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

  useLayoutEffect(() => {
    if (isSticky) {
      return handleOnStickyStateUpdate(fakeRect.width, stickyRect.height, onStick);
    }
    return handleOnStickyStateUpdate(fakeRect.width, 0, onUnStick);
  }, [handleOnStickyStateUpdate, isSticky, stickyRect.height, fakeRect.width, onUnStick, onStick]);

  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  useEffect(() => {
    setParentRef(parentNode || document.body);
  }, [parentNode, setParentRef]);

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
