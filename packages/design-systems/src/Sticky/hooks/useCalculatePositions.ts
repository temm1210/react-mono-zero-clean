import { RefObject, useCallback } from "react";

export interface Props {
  containerRef: Element;
  stickyRef: RefObject<Element | undefined>;
  heightRef?: RefObject<Element | undefined>;
  top?: number;
  bottom?: number;
}

function useCalculatePositions({ containerRef, stickyRef, heightRef, top = 0, bottom = 0 }: Props) {
  const assignRects = useCallback(() => {
    const containerRect = containerRef.getBoundingClientRect();
    const heightRect = heightRef?.current?.getBoundingClientRect();
    const stickyRect = stickyRef.current?.getBoundingClientRect();

    if (!heightRect || !stickyRect) return null;
    return { containerRect, heightRect, stickyRect };
  }, [containerRef, stickyRef, heightRef]);

  /**
   * sticky element의 위치를 확인하여 상태를 계산해주는 함수 모음
   */
  const calculatePositionHandlers = useCallback(() => {
    const rects = assignRects();
    if (!rects) return;

    const { stickyRect, containerRect, heightRect } = rects;

    // sticky영역이 상단에 고정되어있다가 위로 올라가는 시점(viewport에서 container의 위치가 sticky element의 높이보다 작아질때)
    const isReachContainerBottom = () => {
      return stickyRect?.height + top >= containerRect?.bottom + bottom;
    };
    // sticky영역이 현재 viewport상단에 고정되는 시점
    const isReachScreenTop = () => heightRect.top < top;

    // sticky영역이 현재 viewport하단에 고정되는 시점
    const isReachScreenBottom = () => containerRect.bottom + bottom > window.innerHeight;

    return { isReachContainerBottom, isReachScreenTop, isReachScreenBottom };
  }, [top, bottom, assignRects]);

  return calculatePositionHandlers;
}

export default useCalculatePositions;
