/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, ReactNode } from "react";

export type StickyMode = "top" | "bottom";

type StickyViewRef = MutableRefObject<any | null> | ((e: HTMLElement | null) => void);
export interface StickyViewRefProps {
  fakeRef: StickyViewRef;
  stickyRef: StickyViewRef;
  parentRef: StickyViewRef;
}

export type StickyViewCalculateStickyStyle = () => Record<string, any> | undefined;
export type StickyViewFakeStyle = Record<string, any>;

interface StickyViewStyleProps {
  calculateStickyStyle: StickyViewCalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: StickyViewFakeStyle;
  children: ReactNode;
}
export interface StickyViewProps extends StickyViewStyleProps, StickyViewRefProps {
  mode: StickyMode;
}

/**
 * rendering만 담당
 * 상태값을 가지면안됨
 */
const StickyView = ({
  fakeRef,
  stickyRef,
  parentRef,
  mode,
  calculateStickyStyle,
  stickyClassNames,
  fakeStyle,
  children,
}: StickyViewProps): JSX.Element => {
  const modeMapper = {
    top: (
      <div ref={parentRef} className="sticky-wrap">
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
      </div>
    ),

    bottom: (
      <div ref={parentRef} className="sticky-wrap">
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
      </div>
    ),
  };

  return modeMapper[mode];
};

export default StickyView;
