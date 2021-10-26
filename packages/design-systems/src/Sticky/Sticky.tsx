import { useCallback, useEffect } from "react";
import { useEvent, useClosetParent } from "@project/react-hooks";
import { StickyMode } from "./types";
import { parentSelector } from "./utils";
import useUpdate, { Callback } from "./hooks/useUpdate";
import "./Sticky.scss";

export interface Props {
  children: React.ReactNode;
  /** 상단에 붙을지 하단에 붙을지 결정 */
  mode?: StickyMode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top?: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom?: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: Callback;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: Callback;
}

const Sticky = ({ children, top = 0, bottom = 0, mode = "top", onStick, onUnStick }: Props) => {
  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);
  const [{ parentRef, heightRef, stickyRef }, updateHandler, styles] = useUpdate({
    top,
    bottom,
    mode,
    onStick,
    onUnStick,
  });

  const update = useCallback(() => {
    if (!updateHandler) return;
    updateHandler();
  }, [updateHandler]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  useEffect(() => {
    parentRef(parentNode || document.body);
  }, [parentNode, parentRef]);

  const { heightStyle, stickyClassNames, calculateStickyStyle } = styles;

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      {/* fake height */}
      {mode === "top" && <div ref={heightRef} className="sticky__height" style={heightStyle} />}
      <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
        {children}
      </div>
      {/* fake height */}
      {mode === "bottom" && <div ref={heightRef} className="sticky__height" style={heightStyle} />}
    </div>
  );
};

export default Sticky;
