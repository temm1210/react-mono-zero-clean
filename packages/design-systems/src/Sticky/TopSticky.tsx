/* eslint-disable @typescript-eslint/no-explicit-any */
import { useClosetParent, useDeepCompareEffect } from "@project/react-hooks";
import cx from "clsx";
import { forwardRef, ReactNode, useImperativeHandle } from "react";
import usePositionCalculators from "./hooks/usePositionCalculators";
import { StickyModeMapperRef } from "./types";
import { parentSelector } from "./utils";

export interface TopStickyProps {
  top: number;
  width: number;
  height: number;
  isSticky: boolean;
  isAbsolute: boolean;
  children: ReactNode;
}

/**
 * mode가 top인 경우에 해당하는 component
 * forwardedRef에 mode가 top일시 해야할 일 정의
 */
const TopSticky = forwardRef<StickyModeMapperRef, TopStickyProps>(
  ({ top, width, height, isSticky, isAbsolute, children }, forwardedRef) => {
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

    const stickyClassNames = cx(
      !isSticky && "sticky__content",
      isSticky && (isAbsolute ? "sticky__content--absolute" : "sticky__content--fixed"),
    );

    const calculateStickyStyle = () => {
      if (!isSticky) return;
      return {
        top: isAbsolute ? undefined : top,
        bottom: isAbsolute ? 0 : undefined,
        width,
      };
    };

    return (
      <div ref={findParentFrom} className="sticky-wrap">
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={{ height }} />
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
      </div>
    );
  },
);

export default TopSticky;
