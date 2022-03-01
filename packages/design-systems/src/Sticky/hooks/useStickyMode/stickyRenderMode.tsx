/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, ReactNode, useMemo } from "react";
import { StickyMode } from "../../types";

type StickyRenderRef = MutableRefObject<any | null> | ((e: HTMLElement | null) => void);
export interface StickyRenderModeRefProps {
  fakeHeightRef: StickyRenderRef;
  stickyRef: StickyRenderRef;
  parentRef: StickyRenderRef;
}

export type CalculateStickyStyle = () => Record<string, any> | undefined;
export type FakeStyle = Record<string, any>;

interface StickyModeStyleProps {
  calculateStickyStyle: CalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: FakeStyle;
  children: ReactNode;
}

export type StickyRenderModeProps = StickyModeStyleProps;
export type StickyModeComponent = (props: StickyRenderModeProps) => JSX.Element;

export type StickyRenderModeReturn = (refs: StickyRenderModeRefProps) => (mode: StickyMode) => StickyModeComponent;

// rendering만 담당
// 상태값을 가지면안됨
const stickyRenderMode: StickyRenderModeReturn =
  ({ fakeHeightRef, stickyRef, parentRef }) =>
  (mode) =>
  ({ calculateStickyStyle, stickyClassNames, fakeStyle, children }) => {
    const modeMapper = useMemo(
      () => ({
        top: (
          <div ref={parentRef} className="sticky-wrap">
            {/* fake element */}
            <div ref={fakeHeightRef} className="sticky__fake" style={fakeStyle} />
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
            <div ref={fakeHeightRef} className="sticky__fake" style={fakeStyle} />
          </div>
        ),
      }),
      [calculateStickyStyle, children, fakeStyle, stickyClassNames],
    );

    return modeMapper[mode];
  };

export default stickyRenderMode;
