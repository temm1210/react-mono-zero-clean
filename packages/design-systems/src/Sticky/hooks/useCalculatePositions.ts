import { RefObject, useCallback, useEffect, useState } from "react";
import { StickyMode } from "Sticky/types";

export interface Props {
  containerRef: Element;
  stickyRef: RefObject<Element | undefined>;
  heightRef: RefObject<Element | undefined>;
  top?: number;
  bottom?: number;
}

function useCalculatePositions({ containerRef, stickyRef, heightRef, top = 0, bottom = 0 }: Props) {
  const [bodyHeight, setBodyHeight] = useState(0);

  const assignRects = useCallback(() => {
    // console.log("containerRef:", containerRef);
    const containerRect = containerRef.getBoundingClientRect();
    const stickyRect = stickyRef.current?.getBoundingClientRect();
    const heightRect = heightRef.current?.getBoundingClientRect();

    if (!stickyRect || !heightRect || !containerRect) return null;

    return { containerRect, heightRect, stickyRect };
  }, [containerRef, stickyRef, heightRef]);

  /**
   * sticky element의 위치를 계산해주는 함수 모음
   */
  const calculatePositionHandlers = useCallback(() => {
    const rects = assignRects();
    if (!rects) return;
    const { stickyRect, containerRect, heightRect } = rects;

    const isContainerBody = () => containerRect.height >= bodyHeight;

    // sticky영역이 고정되어있다가 움직이기 시작하는 시점
    const isReachContainerBottomFrom = (mode: StickyMode) => {
      // element가 상단에 붙었을때
      if (mode === "top") return stickyRect.height + top >= containerRect.bottom + bottom;
      // 하단에 붙었을때
      return containerRect.bottom + bottom <= window.innerHeight;
    };

    // sticky영역이 현재 viewport상단에 고정되는 시점
    const isReachScreenTop = () => {
      if (isContainerBody()) return true;
      return heightRect.top < top;
    };

    // sticky영역이 현재 viewport하단에 고정되는 시점
    const isReachScreenBottom = () => heightRect.bottom + bottom <= window.innerHeight;

    return { isReachContainerBottomFrom, isReachScreenTop, isReachScreenBottom };
  }, [top, bottom, assignRects, bodyHeight]);

  useEffect(() => {
    setBodyHeight(document.body.getBoundingClientRect().height);
  }, []);

  return calculatePositionHandlers;
}

export default useCalculatePositions;
