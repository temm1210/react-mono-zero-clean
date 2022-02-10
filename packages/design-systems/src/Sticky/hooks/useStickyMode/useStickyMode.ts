import { useMemo, useCallback, useLayoutEffect, useEffect } from "react";
import { useClosetParent } from "@project/react-hooks";
import stickyRenderMode, { StickyModeComponent } from "./stickyRenderMode";
import usePositionCalculators, { PositionCalculator } from "../usePositionCalculators";
import useStatusUpdaters, { StatusUpdateInfo } from "../useStatusUpdaters";
import { parentSelector } from "../../utils";
import { StickyMode } from "../../types";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

interface StickyModeProps {
  top: number;
  bottom: number;
  onStick?: Callback;
  onUnStick?: Callback;
}

export type StatusHandler = () => void;

export interface StickyModeValue {
  isStick: PositionCalculator;
  isReachContainerBottomToMode: PositionCalculator;
  stickyToContainerBottom: StatusHandler;
  stickyToModeOfScreen: StatusHandler;
  unStick: StatusHandler;
  render: StickyModeComponent;
}

export type UseStickyMode = Record<StickyMode, StickyModeValue>;
export interface UseStickyModeReturn extends StatusUpdateInfo {
  stickyModeMapper: UseStickyMode;
}
/**
 * Sticky의 mode에 따라 실행해야할 기능들을 return함
 */
const useStickyMode = ({ top = 0, bottom = 0, onStick, onUnStick }: StickyModeProps): UseStickyModeReturn => {
  // scroll 위치에 따라 현재 엘리먼트의 위치값을 계산하는 handler
  const [[setParentRef], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
    usePositionCalculators({
      top,
      bottom,
    });

  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

  useEffect(() => {
    setParentRef(parentNode || document.body);
  }, [parentNode, setParentRef]);

  // 현재 엘리먼트의 상태값을 업데이트하는 handler와 상태 결과값을 return
  const [statusUpdateHandlers, { isSticky, isAbsolute }] = useStatusUpdaters({ initIsSticky: !parentNode });

  const handleStick = useCallback(
    (callback?: Callback) => {
      const rect = { width: fakeRect.width, height: stickyRect.height, top, bottom };
      callback?.(rect);
    },
    [bottom, fakeRect.width, stickyRect.height, top],
  );

  const renderByMode = stickyRenderMode({
    fakeRef,
    stickyRef,
    parentRef: findParentFrom,
  });

  // sticky가 활성화 됐을때 실행할 callback
  const handleOnStick = useCallback(() => {
    handleStick(onStick);
  }, [handleStick, onStick]);

  // sticky가 비 활성화 됐을때 실행할 callback
  const handleUnStick = useCallback(() => {
    handleStick(onUnStick);
  }, [handleStick, onUnStick]);

  useLayoutEffect(() => {
    if (isSticky) {
      return handleOnStick();
    }
    handleUnStick();
  }, [handleOnStick, handleUnStick, isSticky]);

  const stickyModeMapper = useMemo(
    () => ({
      top: {
        isStick: () => calculatePositionHandlers().isReachScreenTop(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToTop(),
        stickyToContainerBottom: () => statusUpdateHandlers?.stickToContainerBottom(),
        stickyToModeOfScreen: () => statusUpdateHandlers?.stickToScreenTop(),
        unStick: () => statusUpdateHandlers?.unStick(),
        render: renderByMode("top"),
      },
      bottom: {
        isStick: () => calculatePositionHandlers().isReachScreenBottom(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToBottom(),
        stickyToContainerBottom: () => statusUpdateHandlers?.stickToContainerBottom(),
        stickyToModeOfScreen: () => statusUpdateHandlers?.stickyToScreenBottom(),
        unStick: () => statusUpdateHandlers?.unStick(),
        render: renderByMode("bottom"),
      },
    }),
    [calculatePositionHandlers, renderByMode, statusUpdateHandlers],
  );

  return { stickyModeMapper, isSticky, isAbsolute };
};

export default useStickyMode;
