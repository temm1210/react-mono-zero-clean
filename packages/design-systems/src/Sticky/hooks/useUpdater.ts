import { RefObject, useState } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { Return as PositionHandler } from "./useCalculatePositions";
import { StatusHandler, StickyMode } from "../types";

export interface Props {
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode: StickyMode;
  /** sticky여부 */
  isSticky: boolean;
  /** sticky상태에서의 absolute여부 */
  isAbsolute: boolean;
  /** sticky상태값을 update하는 함수모음 */
  statusHandler: StatusHandler;
  /** sticky position 함수모음 */
  positionHandler: PositionHandler;
  /** update의 기준이되는 element */
  ref: RefObject<HTMLDivElement>;
}

const useUpdater = ({ mode, isSticky, isAbsolute, statusHandler, positionHandler, ref }: Props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const getStickyElement = () => {
    const stickyCurrent = ref.current;
    if (!stickyCurrent) return { width: 0, height: 0 };

    const rect = stickyCurrent.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  // TODO: useMemo
  const handler = {
    stickToScreenTop() {
      // https://github.com/facebook/react/issues/10231#issuecomment-316644950
      // scroll event는 react batch작업이 이루어지지 않음
      // 따라서 강제로 batch 실행(unstable_batchedUpdates)
      unstable_batchedUpdates(() => {
        const { width: lWidth, height: lHeight } = getStickyElement();
        setWidth(lWidth);
        setHeight(lHeight);

        statusHandler.stickToScreenTop();
      });
    },

    stickyToScreenBottom() {
      unstable_batchedUpdates(() => {
        const { width: lWidth, height: lHeight } = getStickyElement();
        setWidth(lWidth);
        setHeight(lHeight);

        statusHandler.stickyToScreenBottom();
      });
    },

    stickToContainerBottom() {
      unstable_batchedUpdates(() => {
        statusHandler.stickToContainerBottom();
      });
    },

    unStick() {
      unstable_batchedUpdates(() => {
        statusHandler.unStick();
      });
    },
  };

  const bottomStickyUpdater = () => {
    // sticky 상태일때
    if (positionHandler()?.isReachScreenBottom()) {
      if (positionHandler()?.isReachContainerBottomFrom(mode)) {
        return handler.stickToContainerBottom();
      }
      return handler.stickyToScreenBottom();
    }
  };

  const topStickyUpdater = () => {
    // sticky 상태일때
    if (positionHandler()?.isReachScreenTop()) {
      // sticky상태에서 element가 위로 서서히 사라지기 시작할때
      if (positionHandler()?.isReachContainerBottomFrom("top")) {
        return handler.stickToContainerBottom();
      }
      return handler.stickToScreenTop();
    }
  };

  // 부모에게 위임받아 실제 할 일을 작성
  const updater = () => {
    if (mode === "bottom") return bottomStickyUpdater();
    return topStickyUpdater();
  };

  return updater;
};

export default useUpdater;
