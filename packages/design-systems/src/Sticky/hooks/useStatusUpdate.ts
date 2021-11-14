import { useState, useEffect } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

export interface CallbackProps {
  onStick?: () => void;
  onUnStick?: () => void;
}
export interface StatusUpdateHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  stickyToScreenBottom: () => void;
  unStick: () => void;
}
export interface StatusUpdateInfo {
  isSticky: boolean;
  isAbsolute: boolean;
}

export type StatusUpdateStatusHandler = StatusUpdateHandler | null;
export type StatusUpdateResult = [StatusUpdateStatusHandler, StatusUpdateInfo];

/**
 * sticky component의 상태값을 업데이트
 * sticky component의 상태값 추가, 변경 이외에는 수정되면 안됨
 * 오로지 상태값관련 역할만 담당
 */
const useStatusUpdate = (initIsSticky: boolean, { onStick, onUnStick }: CallbackProps): StatusUpdateResult => {
  const [isSticky, setIsSticky] = useState(initIsSticky);
  const [isAbsolute, setIsIsAbsolute] = useState(false);

  const [handler, setHandler] = useState<StatusUpdateStatusHandler>(null);

  useEffect(() => {
    setIsSticky(initIsSticky);
  }, [initIsSticky]);

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
          onStick?.();
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
