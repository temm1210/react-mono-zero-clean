/* eslint-disable @typescript-eslint/no-explicit-any */
import cx from "clsx";
import { StickyMode, StickyViewCalculateStickyStyle, StickyViewFakeStyle } from "../../StickyView";

export interface Props {
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode: StickyMode;
  /** 현재 component의 sticky여부 */
  isSticky: boolean;
  /** 현재 component의 absolute 여부 */
  isAbsolute: boolean;
  /** 현재 component의 width 값 */
  width: number;
  /** 현재 component의 height 값 */
  height: number;
  /** 현재 component의 상단 offset 값 */
  top: number;
  /** 현재 component의 하단 offset 값 */
  bottom: number;
}

export interface UseStyleStyleMode {
  calculateStickyStyle: StickyViewCalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: StickyViewFakeStyle;
}
export type UseStyleCalculateStyleMode = Record<StickyMode, UseStyleStyleMode>;

/**
 * style과 관련된 로직만 처리
 */
const useStyles = ({ mode, isSticky, isAbsolute, width, height, top, bottom }: Props) => {
  const stickyClassNames = cx(
    !isSticky && "sticky__content",
    isSticky && (isAbsolute ? "sticky__content--absolute" : "sticky__content--fixed"),
  );

  const fakeStyle = { height };

  const calculateStickyStyleByMode: UseStyleCalculateStyleMode = {
    top: {
      calculateStickyStyle: () => {
        if (!isSticky) return;
        return {
          top: isAbsolute ? undefined : top,
          bottom: isAbsolute ? 0 : undefined,
          width,
        };
      },
      stickyClassNames,
      fakeStyle,
    },
    bottom: {
      calculateStickyStyle: () => {
        if (!isSticky) return;
        return {
          bottom: isAbsolute ? 0 : bottom,
          width,
        };
      },
      stickyClassNames,
      fakeStyle,
    },
  };

  return calculateStickyStyleByMode[mode];
};

export default useStyles;
