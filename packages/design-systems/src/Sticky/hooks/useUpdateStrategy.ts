import { useState } from "react";
import { useDeepCompareEffect } from "@project/react-hooks";
import { StatusHandler, StickyMode } from "../types";
import { PositionsReturn } from "./usePositions";

export type StrategyUpdater = () => void;
export type Strategy = Record<StickyMode, StrategyUpdater>;

/**
 * mode에 따라 실행할 update 함수를 정의
 */
const useUpdateStrategy = (statusHandler: StatusHandler | null, positionHandler: PositionsReturn, mode: StickyMode) => {
  const [updater, setUpdater] = useState<Strategy | null>(null);

  useDeepCompareEffect(() => {
    const getHandlersFn = () => {
      const handler = positionHandler();
      if (!handler || !statusHandler) return;
      return { ...handler, ...statusHandler };
    };

    setUpdater({
      top() {
        const getHandlers = getHandlersFn();
        if (!getHandlers) return;

        const { isReachScreenTop, isReachContainerBottomFrom, stickToContainerBottom, stickToScreenTop, unStick } =
          getHandlers;

        // sticky 상태일때
        if (isReachScreenTop()) {
          if (isReachContainerBottomFrom(mode)) {
            return stickToContainerBottom();
          }
          return stickToScreenTop();
        }
        // sticky 상태가 아닐때
        return unStick();
      },

      bottom() {
        const getHandlers = getHandlersFn();
        if (!getHandlers) return;

        const {
          isReachScreenBottom,
          isReachContainerBottomFrom,
          stickToContainerBottom,
          stickyToScreenBottom,
          unStick,
        } = getHandlers;

        // sticky 상태일때
        if (isReachScreenBottom()) {
          if (isReachContainerBottomFrom(mode)) {
            return stickToContainerBottom();
          }
          return stickyToScreenBottom();
        }
        // sticky 상태가 아닐때
        return unStick();
      },
    });
  }, [positionHandler, mode]);

  return updater ? updater[mode] : null;
};

export default useUpdateStrategy;
