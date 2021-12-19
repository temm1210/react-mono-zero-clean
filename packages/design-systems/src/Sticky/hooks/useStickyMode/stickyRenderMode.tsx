/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, ReactNode, useMemo } from "react";
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
  children: ReactNode;
}

export type StickyRenderModeProps = StickyModeStyleProps;
export type StickyModeComponent = (props: StickyRenderModeProps) => JSX.Element;

export type StickyRenderModeReturn = (refs: StickyRenderModeRefProps) => (mode: StickyMode) => StickyModeComponent;
// curry 함수컴포넌트
const stickyRenderMode: StickyRenderModeReturn =
  ({ fakeRef, stickyRef, findParentFrom }) =>
  (mode) =>
  ({ calculateStickyStyle, stickyClassNames, fakeStyle, children }) => {
    const modeMapper = useMemo(
      () => ({
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
      }),
      [calculateStickyStyle, children, fakeStyle, stickyClassNames],
    );

    return modeMapper[mode];
  };

export default stickyRenderMode;
