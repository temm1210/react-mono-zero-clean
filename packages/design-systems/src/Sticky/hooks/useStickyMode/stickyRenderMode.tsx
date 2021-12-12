/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, PropsWithChildren } from "react";
import { FindParentFrom } from "@project/react-hooks/dist/useClosetParent";
import { StickyMode } from "../../types";

export interface StickyRenderModeRefProps {
  fakeRef: MutableRefObject<any | null>;
  stickyRef: MutableRefObject<any | null>;
  findParentFrom: FindParentFrom;
}

export type CalculateStickyStyle = () => Record<string, any> | undefined;
export type FakeStyle = Record<string, any>;

interface StickyModeStyleProps {
  calculateStickyStyle: CalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: FakeStyle;
}

export type StickyRenderModeReturn = Record<StickyMode, JSX.Element>;

// curry 함수컴포넌트
const stickyRenderMode =
  ({ fakeRef, stickyRef, findParentFrom }: StickyRenderModeRefProps) =>
  ({
    calculateStickyStyle,
    stickyClassNames,
    fakeStyle,
    children,
  }: PropsWithChildren<StickyModeStyleProps>): StickyRenderModeReturn => ({
    top: (
      <div ref={findParentFrom} className="sticky-wrap">
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
      </div>
    ),

    bottom: (
      <div ref={findParentFrom} className="sticky-wrap">
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
      </div>
    ),
  });

export default stickyRenderMode;
