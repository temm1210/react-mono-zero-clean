import { useEvent } from "@project/react-hooks";
import { useMemo, useCallback, useLayoutEffect } from "react";
import { usePositionCalculators, useStatusUpdaters } from "..";
import { UsePositionCalculatorRectReturns } from "../usePositionCalculators";
import { UseStatusState } from "../useStatusUpdaters";
import { StickyMode } from "../../types";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

export interface UseStickyOperationProps {
  mode: StickyMode;
  top: number;
  bottom: number;
  onStick?: Callback;
  onUnStick?: Callback;
}

export type UseStickyOperationReturn = [...UsePositionCalculatorRectReturns, UseStatusState];

function useStickyOperation({
  top,
  bottom,
  mode,
  onStick,
  onUnStick,
}: UseStickyOperationProps): UseStickyOperationReturn {
  const [
    [parentRef, parentRect],
    [stickyRef, stickyRect],
    [fakeHeightRef, fakeHeightRect],
    { calculatePositionHandlers },
  ] = usePositionCalculators({
    top,
    bottom,
  });

  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters({ initIsSticky: !parentRect });

  const handleStick = useCallback(
    (callback?: Callback) => {
      const rect = { width: fakeHeightRect.width, height: stickyRect.height, top, bottom };
      callback?.(rect);
    },
    [bottom, fakeHeightRect.width, stickyRect.height, top],
  );

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

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  return [[parentRef, parentRect], [stickyRef, stickyRect], [fakeHeightRef, fakeHeightRect], { isSticky, isAbsolute }];
}

export default useStickyOperation;
