import { useState, useCallback, useLayoutEffect } from "react";
import useUpdateStrategy, { StrategyUpdater } from "./useUpdateStrategy";
import usePositionUpdate from "./usePositionUpdate";
import useStatusUpdate from "./useStatusUpdate";
import useStyles, { StylesValues } from "./useStyles";
import { StickyMode } from "../types";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

export type UpdateElement = (element: Element | null) => void;

export interface ReturnUpdateElement {
  parentRef: UpdateElement;
  heightRef: UpdateElement;
  stickyRef: UpdateElement;
}
export type UpdateReturn = [ReturnUpdateElement, StrategyUpdater | null, StylesValues];

export interface Props {
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode: StickyMode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: Callback;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: Callback;
}

/**
 * controller역할을 하는 hook
 * 여러 hook들을 조합해서 로직을 작성
 */
function useUpdate({ top, bottom, mode, onStick, onUnStick }: Props): UpdateReturn {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [parentElement, parentRef] = useState<Element | null>(null);
  const [heightElement, heightRef] = useState<Element | null>(null);
  const [stickyElement, stickyRef] = useState<Element | null>(null);

  // scroll 위치에 따라 현재 엘리먼트의 위치값을 계산하는 handler
  const positionUpdateHandlers = usePositionUpdate({ parentElement, heightElement, stickyElement, top, bottom });
  // 현재 엘리먼트의 상태값을 계산하는 handler
  const [statusUpdateHandlers, { isSticky, isAbsolute }] = useStatusUpdate();

  // mode에따라 다른 update 함수를 return
  const updateByMode = useUpdateStrategy(mode, { statusUpdateHandlers, positionUpdateHandlers });
  const calculateStyles = useStyles({ mode, isSticky, isAbsolute, width, height, top, bottom });

  const handleOnStick = useCallback(
    (pWidth: number, pHeight: number) => {
      onStick?.({ width: pWidth, height: pHeight, top, bottom });
    },
    [top, bottom, onStick],
  );

  const handleUnStick = useCallback(
    (pWidth: number, pHeight: number) => {
      onUnStick?.({ width: pWidth, height: pHeight, top, bottom });
    },
    [top, bottom, onUnStick],
  );

  // 여기서 업데이트 후 바로 style 적용됨.
  // 근데 paint가 끝난 후 아래 과정을 진행할 시 깜빡임 발생(paint후 스타일 재계산).
  // paint이전 단계에서 style 변경을 해준 후 paint과정을 진행하면 깜빡임 X
  useLayoutEffect(() => {
    const rect = stickyElement?.getBoundingClientRect();
    if (!rect) return;
    const { width: lWidth, height: lHeight } = rect;

    if (isSticky) {
      setHeight(lHeight);
      handleOnStick(lWidth, lHeight);
    } else {
      setHeight(0);
      handleUnStick(lWidth, lHeight);
    }

    setWidth(lWidth);
  }, [isSticky, stickyElement, handleOnStick, handleUnStick]);

  return [{ parentRef, heightRef, stickyRef }, updateByMode, calculateStyles];
}

export default useUpdate;
