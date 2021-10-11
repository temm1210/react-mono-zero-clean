import { RefObject, useCallback } from "react";

export interface Props {
  containerRef: RefObject<Element | undefined>;
  stickyRef: RefObject<Element | undefined>;
  heightRef: RefObject<Element | undefined>;
  offset: number;
}

function useCalculatePositions({ containerRef, stickyRef, heightRef, offset }: Props) {
  const assignRects = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const heightRect = heightRef.current?.getBoundingClientRect();
    const stickyRect = stickyRef.current?.getBoundingClientRect();

    if (!containerRect || !heightRect || !stickyRect) return null;
    return { containerRect, heightRect, stickyRect };
  }, [containerRef, stickyRef, heightRef]);

  /**
   * sticky element의 위치를 확인하여 상태를 계산해주는 함수 모음
   */
  const calculatePositionHandlers = useCallback(() => {
    const rects = assignRects();
    if (!rects) return;

    const { stickyRect, containerRect, heightRect } = rects;

    // sticky영역이 위로 올라가는 시점(viewport에서 container의 위치가 sticky element의 높이보다 작아질때)
    const isReachContainerBottom = () => stickyRect?.height + offset >= containerRect?.bottom;

    // sticky영역이 현재 viewport상단에 고정되는 시점(offset이 주어지면 그만큼 떨어진상태로 고정)
    const isReachScreenTop = () => heightRect.top < offset;

    return { isReachContainerBottom, isReachScreenTop };
  }, [offset, assignRects]);

  return calculatePositionHandlers;
}

export default useCalculatePositions;
