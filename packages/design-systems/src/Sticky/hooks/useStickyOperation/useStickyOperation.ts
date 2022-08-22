import { useEventListener } from "@project/react-hooks";
import { useMemo, useCallback } from "react";
import { UsePositionCalculatorHandlers } from "./usePositionCalculators";
import useStatusUpdaters, { UseStatusState } from "./useStatusUpdaters";
import { StickyMode } from "../../StickyView";

export interface UseStickyOperationProps {
  mode: StickyMode;
  calculatePositionHandlers: () => UsePositionCalculatorHandlers;
}
export type UseStickyOperationReturn = UseStatusState;

/**
 * Sticky component의 기본 로직을 만들고 상태를 업데이트하는 custom hook
 * Sticky component의 handler를 만들고 mode에따른 mapper를 만드는 역할
 */
function useStickyOperation({ calculatePositionHandlers, mode }: UseStickyOperationProps): UseStickyOperationReturn {
  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters();

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

  useEventListener("scroll", update, { passive: true });
  useEventListener("resize", update);

  return { isSticky, isAbsolute };
}

export default useStickyOperation;
