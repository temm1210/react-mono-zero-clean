import { useCallback, useMemo, useRef } from "react";
import { useEvent, useClosetParent } from "@project/react-hooks";
import { ChildHandler, StickyMode } from "./types";
import { parentSelector } from "./utils";
import { useStatement } from "./hooks";
import StickyTop from "./StickyTop";
import StickyBottom from "./StickyBottom";
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
  onStick?: () => void;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: () => void;
}

const Sticky = ({ children, top = 0, bottom = 0, mode = "top", onStick, onUnStick }: Props) => {
  const { parentNode, findParentFrom } = useClosetParent(`.${parentSelector}`);
  const { isSticky, isAbsolute, statusHandler } = useStatement({ onStick, onUnStick });

  // child component에게 넘겨줄 ref
  // 스크롤 이벤트가 발생할시 할 일을 자식에게 위임
  const childRef = useRef<ChildHandler>(null);

  const update = useCallback(() => {
    // 자식컴포넌트에게 위임
    childRef.current?.update();
  }, []);

  const parent = useMemo(() => parentNode || document.body, [parentNode]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  const render = () => {
    if (mode === "top")
      return (
        <StickyTop
          ref={childRef}
          isAbsolute={isAbsolute}
          isSticky={isSticky}
          top={top}
          parent={parent}
          statusHandler={statusHandler}
        >
          {children}
        </StickyTop>
      );

    return (
      <StickyBottom
        ref={childRef}
        isAbsolute={isAbsolute}
        isSticky={isSticky}
        parent={parent}
        statusHandler={statusHandler}
        bottom={bottom}
      >
        {children}
      </StickyBottom>
    );
  };

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      {render()}
    </div>
  );
};

export default Sticky;
