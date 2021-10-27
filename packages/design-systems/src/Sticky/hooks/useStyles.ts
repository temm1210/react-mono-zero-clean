/* eslint-disable @typescript-eslint/no-explicit-any */
import cx from "clsx";
import { StickyMode } from "../types";

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

export type CalculateStickyStyle = () => Record<string, any> | undefined;
export type HeightStyle = Record<string, any>;

export interface StylesValues {
  calculateStickyStyle: CalculateStickyStyle;
  stickyClassNames: string;
  heightStyle: HeightStyle;
}
export type Styles = Record<StickyMode, StylesValues>;

/**
 * style과 관련된 로직만 처리
 */
const useStyles = ({ mode, isSticky, isAbsolute, width, height, top, bottom }: Props) => {
  const stickyClassNames = cx(
    !isSticky && "sticky__content",
    isSticky && (isAbsolute ? "sticky__content--absolute" : "sticky__content--fixed"),
  );

  const heightStyle = { height };

  const calculateStickyStyle: Styles = {
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
      heightStyle,
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
      heightStyle,
    },
  };

  return calculateStickyStyle[mode];
};

export default useStyles;
