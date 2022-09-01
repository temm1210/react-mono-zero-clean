/* eslint-disable @typescript-eslint/no-explicit-any */
import { useClosetParent, useDeepCompareEffect } from "@project/react-hooks";
import { forwardRef, ReactNode, useImperativeHandle } from "react";
import usePositionCalculators from "./hooks/usePositionCalculators";
import { StickyModeMapperRef } from "./types";
import { parentSelector } from "./utils";

export type BottomStickyCalculateStickyStyle = () => Record<string, any> | undefined;
export type BottomStickyFakeStyle = Record<string, any>;

interface BottomStickyStyleProps {
  calculateStickyStyle: BottomStickyCalculateStickyStyle;
  stickyClassNames: string;
  fakeStyle: BottomStickyFakeStyle;
  children: ReactNode;
}
export interface BottomStickyProps extends BottomStickyStyleProps {
  bottom?: number;
}

/**
 * mode가 bottom인 경우에 해당하는 component
 * forwardedRef에 mode가 bottom일시 해야할 일 정의
 */
const BottomSticky = forwardRef<StickyModeMapperRef, BottomStickyProps>(
  ({ bottom, calculateStickyStyle, stickyClassNames, fakeStyle, children }, forwardedRef) => {
    const [[setParent], [stickyRef, stickyRect], [fakeRef, fakeRect], { calculatePositionHandlers }] =
      usePositionCalculators({
        bottom,
      });

    const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);

    useDeepCompareEffect(() => {
      setParent(parentNode || document.body);
    }, [parentNode, setParent]);

    useImperativeHandle(forwardedRef, () => ({
      isReachScreenToMode: () => calculatePositionHandlers().isReachScreenBottom(),
      isReachContainerBottomToMode: () => calculatePositionHandlers().isReachContainerBottomToBottom(),
      stickyRect: stickyRect as DOMRectReadOnly,
      fakeRect: fakeRect as DOMRectReadOnly,
      parentNode,
    }));

    return (
      <div ref={findParentFrom} className="sticky-wrap">
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={fakeStyle} />
      </div>
    );
  },
);

export default BottomSticky;
