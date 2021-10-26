import { useState } from "react";
import { useDeepCompareEffect } from "@project/react-hooks";
import { StatusUpdateHandler } from "./useStatusUpdate";
import { PositionUpdateHandlersFn } from "./usePositionUpdate";
import { StickyMode } from "../types";

export type StrategyUpdater = () => void;
export type Strategy = Record<StickyMode, StrategyUpdater>;

export interface UpdateStrategyHandlers {
  statusUpdateHandlers: StatusUpdateHandler | null;
  positionUpdateHandlers: PositionUpdateHandlersFn;
}
/**
 * mode에 따라 실행할 update 함수를 정의
 */
const useUpdateStrategy = (
  mode: StickyMode,
  { statusUpdateHandlers, positionUpdateHandlers }: UpdateStrategyHandlers,
) => {
  const [updater, setUpdater] = useState<Strategy | null>(null);

  useDeepCompareEffect(() => {
    const getHandlersFn = () => {
      const handler = positionUpdateHandlers();
      if (!handler || !statusUpdateHandlers) return;
      return { ...handler, ...statusUpdateHandlers };
    };

    const update = {
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
    };

    setUpdater(update);
  }, [positionUpdateHandlers, mode]);

  return updater ? updater[mode] : null;
};

export default useUpdateStrategy;
