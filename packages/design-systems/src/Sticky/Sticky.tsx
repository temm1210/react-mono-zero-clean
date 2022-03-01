import { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { useClosetParent } from "@project/react-hooks";
import { parentSelector } from "./utils";
import { StickyMode } from "./types";
import { useStyles, useStickyOperation } from "./hooks";
import { stickyRenderMode } from "./hooks/useStickyMode";
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
  const [[setParentRef], [stickyRef, stickyRect], [fakeHeightRef, fakeHeightRect], { isSticky, isAbsolute }] =
    useStickyOperation({
      mode,
      top,
      bottom,
    });
  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  useEffect(() => {
    setParentRef(parentNode || document.body);
  }, [parentNode, setParentRef]);

  const setWidthHeight = (pWidth: number, pHeight: number) => {
    setWidth(pWidth);
    setHeight(pHeight);
  };

  // 상태가 sticky로 변할 때 실행할 callback
  const handleOnStick = useCallback(() => {
    const rect = { width: fakeHeightRect.width, height: stickyRect.height, top, bottom };
    setWidthHeight(rect.width, rect.height);
    onStick?.(rect);
  }, [bottom, fakeHeightRect.width, onStick, stickyRect.height, top]);

  // 상태가 unSticky로 변할 때 실행할 callback
  const handleOnUnStick = useCallback(() => {
    const rect = { width: fakeHeightRect.width, height: stickyRect.height, top, bottom };
    setWidthHeight(rect.width, 0);
    onUnStick?.(rect);
  }, [bottom, fakeHeightRect.width, onUnStick, stickyRect.height, top]);

  useLayoutEffect(() => {
    if (isSticky) {
      return handleOnStick();
    }
    handleOnUnStick();
  }, [handleOnStick, handleOnUnStick, isSticky]);

  const renderByMode = stickyRenderMode({
    fakeHeightRef,
    stickyRef,
    parentRef: findParentFrom,
  });

  const render = renderByMode(mode);

  const { fakeStyle, stickyClassNames, calculateStickyStyle } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  return render({ fakeStyle, stickyClassNames, calculateStickyStyle, children });
};

export default Sticky;
