import { RefObject, useCallback } from "react";
import { StickyMode } from "Sticky/types";

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
    const stickyRect = stickyRef.current?.getBoundingClientRect();
    const heightRect = heightRef?.current?.getBoundingClientRect();

    if (!stickyRect) return null;
    if (!heightRect) return { containerRect, stickyRect };

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
    const isReachContainerBottomFrom = (mode: StickyMode) => {
      if (mode === "top") return stickyRect?.height + top >= containerRect?.bottom + bottom;
      return null;
    };

    // sticky영역이 현재 viewport상단에 고정되는 시점
    const isReachScreenTop = () => (heightRect ? heightRect?.top < top : false);

    // sticky영역이 현재 viewport하단에 고정되는 시점
    const isReachScreenBottom = () => containerRect.bottom + bottom > window.innerHeight;

    return { isReachContainerBottomFrom, isReachScreenTop, isReachScreenBottom, test };
  }, [top, bottom, assignRects]);

  return calculatePositionHandlers;
}

export default useCalculatePositions;
