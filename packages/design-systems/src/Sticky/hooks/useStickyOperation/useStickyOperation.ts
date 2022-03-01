import { useMemo, useCallback, useEffect, useLayoutEffect } from "react";
import { useClosetParent } from "@project/react-hooks";
import { parentSelector } from "Sticky/utils";
import { usePositionCalculators, useStatusUpdaters } from "..";
import stickyRenderMode from "../useStickyMode/stickyRenderMode";

export type Rect = Pick<DOMRectReadOnly, "top" | "bottom" | "height" | "width">;

export type CallbackParameter = Record<keyof Rect, number>;
export type Callback = (rect: CallbackParameter) => void;

export interface useStickyOperationProps {
  top: number;
  bottom: number;
  onStick?: Callback;
  onUnStick?: Callback;
}

function useStickyOperation({ top, bottom, onStick, onUnStick }: useStickyOperationProps) {
  const [[setParentRef], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
    usePositionCalculators({
      top,
      bottom,
    });

  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);
  const [statusUpdaters, { isSticky, isAbsolute }] = useStatusUpdaters({ initIsSticky: !parentNode });

  useEffect(() => {
    setParentRef(parentNode || document.body);
  }, [parentNode, setParentRef]);

  const renderByMode = stickyRenderMode({
    fakeRef,
    stickyRef,
    parentRef: findParentFrom,
  });

  const handleStick = useCallback(
    (callback?: Callback) => {
      const rect = { width: fakeRect.width, height: stickyRect.height, top, bottom };
      callback?.(rect);
    },
    [bottom, fakeRect.width, stickyRect.height, top],
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
        render: renderByMode("top"),
      },
      bottom: {
        isStick: () => calculatePositionHandlers().isReachScreenBottom(),
        isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToBottom(),
        stickyToContainerBottom: () => statusUpdaters?.stickToContainerBottom(),
        stickyToModeOfScreen: () => statusUpdaters?.stickyToScreenBottom(),
        unStick: () => statusUpdaters?.unStick(),
        render: renderByMode("bottom"),
      },
    }),
    [calculatePositionHandlers, renderByMode, statusUpdaters],
  );

  return { stickyModeMapper, isSticky, isAbsolute };
}

export default useStickyOperation;
