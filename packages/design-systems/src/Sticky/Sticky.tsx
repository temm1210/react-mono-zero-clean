import { useCallback, useMemo, useRef } from "react";
import { useEvent, useClosetParent } from "@project/react-hooks";
import { StickyMode } from "./types";
import { parentSelector } from "./utils";
import { usePositions, useUpdateStrategy, useStyles } from "./hooks";
import useStatus, { Callbacks } from "./hooks/useStatus";
import "./Sticky.scss";

export interface Props extends Callbacks {
  children: React.ReactNode;
  /** 컴포넌트 name(식별자) */
  name?: string;
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode?: StickyMode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top?: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom?: number;
}

const Sticky = ({ children, top = 0, bottom = 0, mode = "top", name, onStick, onUnStick }: Props) => {
  const heightRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [statusHandler, { width, height, isSticky, isAbsolute }] = useStatus(stickyRef, { onStick, onUnStick });

  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);
  const parent = useMemo(() => parentNode || document.body, [parentNode]);

  const positionHandlers = usePositions({
    containerRef: parent,
    stickyRef,
    heightRef,
    top,
    bottom,
  });

  const updateHandler = useUpdateStrategy(statusHandler, positionHandlers, mode);
  const update = useCallback(() => {
    if (!updateHandler) return;
    updateHandler();
  }, [updateHandler]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  const { calculateStickyStyle, heightStyle, stickyClassNames } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  return (
    <div ref={findParentFrom} className="sticky-wrap" data-name={name}>
      {/* fake height */}
      {mode === "top" && <div ref={heightRef} className="sticky__height" style={heightStyle} />}
      <div ref={stickyRef} className={stickyClassNames} style={{ ...calculateStickyStyle(), boxSizing: "border-box" }}>
        {children}
      </div>
      {mode === "bottom" && <div ref={heightRef} className="sticky__height" style={heightStyle} />}
    </div>
  );
};

export default Sticky;
