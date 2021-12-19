import { useRef } from "react";
import { useClosetParent } from "@project/react-hooks";
import usePositionCalculators, { PositionCalculator } from "../usePositionCalculators";
import useStatusUpdaters from "../useStatusUpdaters";
import { parentSelector } from "../../utils";
import { StickyMode } from "../../types";

interface StickyModeProps {
  top: number;
  bottom: number;
}

export type StatusHandler = () => void;

export interface StickyModeValue {
  isStick: PositionCalculator;
  isReachContainerBottomToMode: PositionCalculator;
  stickyToContainerBottom: StatusHandler;
  stickyToModeOfScreen: StatusHandler;
  unStick: StatusHandler;
}

export type UseStickyModeReturn = Record<StickyMode, StickyModeValue>;

/**
 * Sticky의 mode에 따라 실행해야할 기능들을 return함
 */
const useStickyMode = ({ top = 0, bottom = 0 }: StickyModeProps): UseStickyModeReturn => {
  const fakeRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const { parentNode, findParentFrom: _ } = useClosetParent(`.${parentSelector}`);

  // scroll 위치에 따라 현재 엘리먼트의 위치값을 계산하는 handler
  const positionCalculators = usePositionCalculators(parentNode || document.body, fakeRef.current, stickyRef.current, {
    top,
    bottom,
  })();

  // 현재 엘리먼트의 상태값을 업데이트하는 handler와 상태 결과값을 return
  const [statusUpdateHandlers, { isSticky, isAbsolute }] = useStatusUpdaters(!parentNode);

  return {
    top: {
      isStick: () => positionCalculators?.isReachScreenTop() || false,
      isReachContainerBottomToMode: () => positionCalculators?.isReachContainerBottomToTop() || false,
      stickyToContainerBottom: () => statusUpdateHandlers?.stickToContainerBottom(),
      stickyToModeOfScreen: () => statusUpdateHandlers?.stickToScreenTop(),
      unStick: () => statusUpdateHandlers?.unStick(),
    },
    bottom: {
      isStick: () => positionCalculators?.isReachScreenBottom() || false,
      isReachContainerBottomToMode: () => positionCalculators?.isReachContainerBottomToBottom() || false,
      stickyToContainerBottom: () => statusUpdateHandlers?.stickToContainerBottom(),
      stickyToModeOfScreen: () => statusUpdateHandlers?.stickyToScreenBottom(),
      unStick: () => statusUpdateHandlers?.unStick(),
    },
  };
};

export default useStickyMode;
