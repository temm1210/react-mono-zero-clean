import { useEffect, useState } from "react";
import { StatusUpdateHandlersReturn } from "./useStatusUpdate";
import { PositionUpdateHandlersFn } from "./usePositionUpdate";
import { StickyMode } from "../types";

export type Update = () => void;
export type HandlerByMode = Record<StickyMode, Update>;

export interface UpdateHandlersByMode {
  statusUpdateHandlers: StatusUpdateHandlersReturn;
  positionUpdateHandlers: PositionUpdateHandlersFn;
}
/**
 * mode에 따라 실행할 update 함수를 정의
 */
const useUpdateByMode = (mode: StickyMode, { statusUpdateHandlers, positionUpdateHandlers }: UpdateHandlersByMode) => {
  const [updater, setUpdater] = useState<HandlerByMode | null>(null);

  useEffect(() => {
    const getHandlersFn = () => {
      const handler = positionUpdateHandlers();

      if (!handler || !statusUpdateHandlers) return;
      return { ...handler, ...statusUpdateHandlers };
    };

    const update = {
      top() {
        const getHandlers = getHandlersFn();
        if (!getHandlers) return;

        const { isReachScreenTop, isReachContainerBottomToTop, stickToContainerBottom, stickToScreenTop, unStick } =
          getHandlers;

        // sticky 상태일때
        if (isReachScreenTop()) {
          if (isReachContainerBottomToTop()) {
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
          isReachContainerBottomToBottom,
          stickToContainerBottom,
          stickyToScreenBottom,
          unStick,
        } = getHandlers;

        // sticky 상태일때
        if (isReachScreenBottom()) {
          if (isReachContainerBottomToBottom()) {
            return stickToContainerBottom();
          }
          return stickyToScreenBottom();
        }
        // sticky 상태가 아닐때
        return unStick();
      },
    };

    setUpdater(update);
  }, [positionUpdateHandlers, statusUpdateHandlers]);

  return updater ? updater[mode] : null;
};

export default useUpdateByMode;
