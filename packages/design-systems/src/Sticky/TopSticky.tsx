/* eslint-disable @typescript-eslint/no-explicit-any */
import { useClosetParent, useDeepCompareEffect } from "@project/react-hooks";
import { forwardRef, ReactNode, useImperativeHandle } from "react";
import usePositionCalculators from "./hooks/usePositionCalculators";
import { StickyModeMapperRef } from "./types";
import { parentSelector } from "./utils";

export type TopStickyCalculateStickyStyle = () => Record<string, any> | undefined;
export type TopStickyFakeStyle = Record<string, any>;

interface TopStickyStyleProps {
  calculateStickyStyle: TopStickyCalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: TopStickyFakeStyle;
  children: ReactNode;
}
export interface TopStickyProps extends TopStickyStyleProps {
  top?: number;
}

/**
 * mode가 top인 경우에 해당하는 component
 * forwardedRef에 mode가 top일시 해야할 일 정의
 */
const TopSticky = forwardRef<StickyModeMapperRef, TopStickyProps>(
  ({ top, calculateStickyStyle, stickyClassNames, fakeStyle, children }, forwardedRef) => {
    const [[setParent], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
      usePositionCalculators({
        top,
      });

    const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

    useDeepCompareEffect(() => {
      setParent(parentNode || document.body);
    }, [parentNode, setParent]);

    useImperativeHandle(forwardedRef, () => ({
      isReachScreenToMode: () => calculatePositionHandlers().isReachScreenTop(),
      isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToTop(),
      stickyRect: stickyRect as DOMRectReadOnly,
      fakeRect: fakeRect as DOMRectReadOnly,
      parentNode,
    }));

    return (
      <div ref={findParentFrom} className="sticky-wrap">
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
      </div>
    );
  },
);

export default TopSticky;
