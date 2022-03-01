import { useEvent } from "@project/react-hooks";
import { useMemo, useCallback } from "react";
import usePositionCalculators, { UsePositionCalculatorRectReturns } from "./usePositionCalculators";
import useStatusUpdaters, { UseStatusState } from "./useStatusUpdaters";
import { StickyMode } from "../../StickyView";

export interface UseStickyOperationProps {
  mode: StickyMode;
  top: number;
  bottom: number;
}
export type UseStickyOperationReturn = [...UsePositionCalculatorRectReturns, UseStatusState];

/**
 * Sticky component의 기본 로직을 만들고 상태를 업데이트하는 custom hook
 * Sticky의 동작과 관련된 최상위 custom hook
 */
function useStickyOperation({ top, bottom, mode }: UseStickyOperationProps): UseStickyOperationReturn {
  const [[parentRef, parentRect], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
    usePositionCalculators({
      top,
      bottom,
    });
  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters({ initIsSticky: !parentRect });

  const stickyModeMapper = useMemo(
    () => ({
      top: {
        isStick: () => calculatePositionHandlers().isReachScreenTop(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToTop(),
        stickyToContainerBottom: () => statusUpdaters?.stickToContainerBottom(),
        stickyToModeOfScreen: () => statusUpdaters?.stickToScreenTop(),
        unStick: () => statusUpdaters?.unStick(),
      },
      bottom: {
        isStick: () => calculatePositionHandlers().isReachScreenBottom(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToBottom(),
        stickyToContainerBottom: () => statusUpdaters?.stickToContainerBottom(),
        stickyToModeOfScreen: () => statusUpdaters?.stickyToScreenBottom(),
        unStick: () => statusUpdaters?.unStick(),
      },
    }),
    [calculatePositionHandlers, statusUpdaters],
  );

  const stickyMapper = stickyModeMapper[mode];

  // scroll event에 등록할 handler
  const update = useCallback(() => {
    const { isStick, unStick, isReachContainerBottomToMode, stickyToContainerBottom, stickyToModeOfScreen } =
      stickyMapper;

    if (isStick()) {
      if (isReachContainerBottomToMode()) {
        return stickyToContainerBottom();
      }
      return stickyToModeOfScreen();
    }
    return unStick();
  }, [stickyMapper]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  return [[parentRef, parentRect], [stickyRef, stickyRect], [fakeRef, fakeRect], { isSticky, isAbsolute }];
}

export default useStickyOperation;
