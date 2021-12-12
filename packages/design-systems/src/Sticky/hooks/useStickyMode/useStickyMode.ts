import { useRef } from "react";
import { useClosetParent } from "@project/react-hooks";
import usePositionCalculators, { PositionCalculator } from "../usePositionCalculators";
import { StickyMode } from "../../types";
import { parentSelector } from "../../utils";

interface StickyModeProps {
  top: number;
  bottom: number;
}

export type StatusHandler = () => void;

export interface StickyModeValue {
  isStick: PositionCalculator;
  isReachContainerBottom: PositionCalculator;
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

  return {
    top: {
      isStick: () => true,
      isReachContainerBottom: () => positionCalculators?.isReachContainerBottomToTop() || false,
      stickyToContainerBottom: () => true,
      stickyToModeOfScreen: () => true,
      unStick: () => true,
    },
    bottom: {
      isStick: () => true,
      isReachContainerBottom: () => true,
      stickyToContainerBottom: () => true,
      stickyToModeOfScreen: () => true,
      unStick: () => true,
    },
  };
};

export default useStickyMode;
