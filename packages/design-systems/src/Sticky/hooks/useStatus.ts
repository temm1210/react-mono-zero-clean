import { useState, RefObject, useEffect, useCallback } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { StatusHandler } from "../types";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (name: CallbackParameter) => void;

export interface Callbacks {
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: Callback;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: Callback;
}

export interface UpdaterInfo {
  isSticky: boolean;
  isAbsolute: boolean;
  width: number;
  height: number;
}

export type UpdaterStatusHandler = StatusHandler | null;
export type UpdaterResult = [UpdaterStatusHandler, UpdaterInfo];

const defaultRect: Rect = {
  top: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

/**
 * sticky component의 기본 명세서
 */
const useUpdater = (ref: RefObject<HTMLDivElement>, { onStick, onUnStick }: Callbacks): UpdaterResult => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [handler, setHandler] = useState<StatusHandler | null>(null);

  useEffect(() => {
    const getStickyElement = () => {
      const stickyCurrent = ref.current;
      if (!stickyCurrent) return defaultRect;

      const rect = stickyCurrent.getBoundingClientRect();

      return rect;
    };

    setHandler({
      stickToScreenTop() {
        // https://github.com/facebook/react/issues/10231#issuecomment-316644950
        // scroll event는 react batch작업이 이루어지지 않음
        // 따라서 강제로 batch 실행(unstable_batchedUpdates)
        unstable_batchedUpdates(() => {
          const { width: lWidth, height: lHeight, top, bottom } = getStickyElement();
          setWidth(lWidth);
          setHeight(lHeight);
          setIsSticky(true);
          setIsIsAbsolute(false);

          onStick?.({ width: lWidth, height: lHeight, top, bottom });
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
          const { width: lWidth, height: lHeight } = getStickyElement();
          setWidth(lWidth);
          setHeight(lHeight);
          setIsSticky(true);
          setIsIsAbsolute(false);

          onStick?.({ width: lWidth, height: lHeight });
        });
      },

      unStick() {
        unstable_batchedUpdates(() => {
          const { width: lWidth } = getStickyElement();

          setHeight(0);
          setIsSticky(false);
          setIsIsAbsolute(false);

          onUnStick?.({ width: lWidth, height: 0 });
        });
      },
    });
  }, [onStick, onUnStick, ref]);

  return [handler, { width, height, isSticky, isAbsolute }];
};

export default useUpdater;
