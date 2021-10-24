import { useState, useEffect } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { StatusHandler } from "../types";

export interface StatusUpdateCallback {
  onStick: () => void;
  onUnStick: () => void;
}
export interface StatusUpdateInfo {
  isSticky: boolean;
  isAbsolute: boolean;
}

export type StatusUpdateStatusHandler = StatusHandler | null;
export type StatusUpdateResult = [StatusUpdateStatusHandler, StatusUpdateInfo];

/**
 * sticky component의 기본 명세서
 */
const useStatusUpdate = ({ onStick, onUnStick }: StatusUpdateCallback): StatusUpdateResult => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);

  const [handler, setHandler] = useState<StatusHandler | null>(null);

  useEffect(() => {
    setHandler({
      stickToScreenTop() {
        // https://github.com/facebook/react/issues/10231#issuecomment-316644950
        // scroll event는 react batch작업이 이루어지지 않음
        // 따라서 강제로 batch 실행(unstable_batchedUpdates)
        unstable_batchedUpdates(() => {
          setIsSticky(true);
          setIsIsAbsolute(false);

          onStick?.();
        });
      },

      // container bottom를 기준으로해서 sticky를 고정
      stickToContainerBottom() {
        unstable_batchedUpdates(() => {
          setIsSticky(true);
          setIsIsAbsolute(true);
        });
      },

      stickyToScreenBottom() {
        unstable_batchedUpdates(() => {
          setIsSticky(true);
          setIsIsAbsolute(false);

          onStick?.();
        });
      },

      unStick() {
        unstable_batchedUpdates(() => {
          setIsSticky(false);
          setIsIsAbsolute(false);

          onUnStick?.();
        });
      },
    });
  }, [onStick, onUnStick]);

  return [handler, { isSticky, isAbsolute }];
};

export default useStatusUpdate;
