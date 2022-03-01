import { useRect } from "@project/react-hooks";
import { UseClientRect, UseRectRef } from "@project/react-hooks/src/useRect";

export type UsePositionCalculatorHandler = () => boolean;

export interface UsePositionCalculatorHandlers {
  isReachContainerBottomToTop: UsePositionCalculatorHandler;
  isReachContainerBottomToBottom: UsePositionCalculatorHandler;
  isReachScreenTop: UsePositionCalculatorHandler;
  isReachScreenBottom: UsePositionCalculatorHandler;
}

export type UsePositionCalculatorRect = [UseRectRef, UseClientRect];

export type UsePositionCalculatorRectReturns = [
  UsePositionCalculatorRect,
  UsePositionCalculatorRect,
  UsePositionCalculatorRect,
];

export interface UsePositionCalculatorRectProps {
  top: number;
  bottom: number;
}
export type UsePositionCalculatorReturn = [
  ...UsePositionCalculatorRectReturns,
  { calculatePositionHandlers: () => UsePositionCalculatorHandlers },
];

/**
 * scroll 위치에따라 sticky component의 위치값 계산
 * 오로지 component의 위치계산 역할만 담당
 * @returns {PositionsReturn}
 */
const usePositionCalculator = ({
  top = 0,
  bottom = 0,
}: UsePositionCalculatorRectProps): UsePositionCalculatorReturn => {
  const [parentRef, getParentRect] = useRect();
  const [stickyRef, getStickyRect] = useRect();
  const [heightRef, getHeightRect] = useRect();

  const calculatePositionHandlers = () => {
    const stickyRect = getStickyRect();
    const parentRect = getParentRect();
    const heightRect = getHeightRect();

    // sticky영역의 상단이 container의 bottom과 위치가 같을때
    // sticky element가 서서히 위로 올라가기 시작하는 시점
    // top mode
    const isReachContainerBottomToTop = () => {
      if (!stickyRect || !parentRect) return false;
      return stickyRect.height + top >= parentRect.bottom + bottom;
    };

    // sticky영역이 container의 bottom과 위치가 같을때
    // sticky element가 서서히 위로 올라가기 시작하는 시점
    // bottom mode
    const isReachContainerBottomToBottom = () => {
      if (!stickyRect || !parentRect) return false;
      return parentRect.bottom + bottom <= window.innerHeight;
    };

    // sticky영역이 현재 viewport상단에 고정되는 시점
    const isReachScreenTop = () => {
      if (!heightRect) return false;
      return heightRect.top < top;
    };

    // sticky영역이 현재 viewport하단에 고정되는 시점
    const isReachScreenBottom = () => {
      if (!heightRect) return false;
      return heightRect.bottom + bottom <= window.innerHeight;
    };

    return { isReachContainerBottomToTop, isReachContainerBottomToBottom, isReachScreenTop, isReachScreenBottom };
  };

  return [
    [parentRef, getParentRect()],
    [stickyRef, getStickyRect()],
    [heightRef, getHeightRect()],
    { calculatePositionHandlers },
  ];
};

export default usePositionCalculator;
