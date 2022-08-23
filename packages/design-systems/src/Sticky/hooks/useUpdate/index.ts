import { useEventListener } from "@project/react-hooks";
import { useCallback, useMemo } from "react";
import { StickyMode } from "../../StickyView";
import { UsePositionCalculatorHandlers } from "../usePositionCalculators";
import { UseStatusUpdateHandlersReturn } from "../useStatusUpdaters";

export interface UseUpdateProps {
  positionHandlers: () => UsePositionCalculatorHandlers;
  statusUpdaters: UseStatusUpdateHandlersReturn;
  mode: StickyMode;
}

/**
 * Sticky컴포넌트가 어떠한 방식으로 움직이고 업데이트할지를 결정하는 hook
 */
function useUpdate({ positionHandlers, statusUpdaters, mode }: UseUpdateProps) {
  const stickyModeMapper = useMemo(
    () => ({
      top: {
        isReachScreenToMode: () => positionHandlers().isReachScreenTop(),
        isReachContainerBottomToMode: () => positionHandlers().isReachContainerBottomToTop(),
      },
      bottom: {
        isReachScreenToMode: () => positionHandlers().isReachScreenBottom(),
        isReachContainerBottomToMode: () => positionHandlers().isReachContainerBottomToBottom(),
      },
    }),
    [positionHandlers],
  );

  const stickyMapper = stickyModeMapper[mode];

  // scroll event에 등록할 handler
  const update = useCallback(() => {
    const { isReachScreenToMode, isReachContainerBottomToMode } = stickyMapper;

    if (isReachScreenToMode()) {
      if (isReachContainerBottomToMode()) {
        return statusUpdaters?.stickToContainerBottom();
      }

      return statusUpdaters?.stickToScreenMode();
    }
    return statusUpdaters?.unStick();
  }, [statusUpdaters, stickyMapper]);

  useEventListener("scroll", update, { passive: true });
  useEventListener("resize", update);
}

export default useUpdate;
