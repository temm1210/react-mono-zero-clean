import { useCallback } from "react";

export interface RectProps {
  top: number;
  bottom: number;
}

export interface PositionUpdateHandlers {
  isReachContainerBottomToTop: () => boolean;
  isReachContainerBottomToBottom: () => boolean;
  isReachScreenTop: () => boolean;
  isReachScreenBottom: () => boolean;
}
export type PositionUpdateHandlersFn = () => PositionUpdateHandlers | undefined;
export type PositionUpdateReturn = PositionUpdateHandlersFn;

/**
 * scroll 위치에따라 sticky component의 위치값 계산
 * 오로지 component의 위치계산 역할만 담당
 * @returns {PositionsReturn}
 */
const usePositionUpdate = (
  parentElement: Element | null,
  heightElement: Element | null,
  stickyElement: Element | null,
  { top = 0, bottom = 0 }: RectProps,
): PositionUpdateReturn => {
  const assignRects = useCallback(() => {
    const parentRect = parentElement?.getBoundingClientRect();
    const stickyRect = stickyElement?.getBoundingClientRect();
    const heightRect = heightElement?.getBoundingClientRect();

    if (!stickyRect || !heightRect || !parentRect) return null;
    return { parentRect, heightRect, stickyRect };
  }, [parentElement, heightElement, stickyElement]);

  /**
   * sticky element의 위치를 계산해주는 함수 모음
   */
  const calculatePositionHandlers = useCallback(() => {
    const rects = assignRects();
    if (!rects) return;
    const { stickyRect, parentRect, heightRect } = rects;

    // sticky영역의 상단이 container의 bottom과 위치가 같을때
    // sticky element가 서서히 위로 올라가기 시작하는 시점
    const isReachContainerBottomToTop = () => {
      // element가 상단에 붙었을때
      return stickyRect.height + top >= parentRect.bottom + bottom;
    };

    // sticky영역이 container의 bottom과 위치가 같을때
    // sticky element가 서서히 위로 올라가기 시작하는 시점
    const isReachContainerBottomToBottom = () => {
      // 하단에 붙었을때
      return parentRect.bottom + bottom <= window.innerHeight;
    };

    // sticky영역이 현재 viewport상단에 고정되는 시점
    const isReachScreenTop = () => heightRect.top < top;

    // sticky영역이 현재 viewport하단에 고정되는 시점
    const isReachScreenBottom = () => heightRect.bottom + bottom <= window.innerHeight;

    return { isReachContainerBottomToTop, isReachContainerBottomToBottom, isReachScreenTop, isReachScreenBottom };
  }, [top, bottom, assignRects]);

  return calculatePositionHandlers;
};

export default usePositionUpdate;
