/* eslint-disable @typescript-eslint/no-explicit-any */
import { useClosetParent, useDeepCompareEffect } from "@project/react-hooks";
import { forwardRef, ReactNode, useImperativeHandle } from "react";
import cx from "clsx";
import usePositionCalculators from "../hooks/usePositionCalculators";
import { StickyModeMapperRef } from "../types";
import { parentSelector } from "../utils";

export interface BottomStickyProps {
  bottom: number;
  width: number;
  height: number;
  isSticky: boolean;
  isAbsolute: boolean;
  children: ReactNode;
}

/**
 * mode가 bottom인 경우에 해당하는 component
 * forwardedRef에 mode가 bottom일시 해야할 일 정의
 */
const BottomSticky = forwardRef<StickyModeMapperRef, BottomStickyProps>(
  ({ bottom, width, height, isSticky, isAbsolute, children }, forwardedRef) => {
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

    const stickyClassNames = cx(
      !isSticky && "sticky__content",
      isSticky && (isAbsolute ? "sticky__content--absolute" : "sticky__content--fixed"),
    );

    const calculateStickyStyle = () => {
      if (!isSticky) return;
      return {
        bottom: isAbsolute ? 0 : bottom,
        width,
      };
    };

    return (
      <div ref={findParentFrom} className="sticky-wrap">
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
        {/* fake element */}
        <div ref={fakeRef} className="sticky__fake" style={{ height }} />
      </div>
    );
  },
);

export default BottomSticky;
