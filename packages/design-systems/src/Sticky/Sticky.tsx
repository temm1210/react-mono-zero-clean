import { useCallback, useEffect, useRef, useState } from "react";
import cx from "clsx";
import { useEvent, useClosetParent } from "@project/react-hooks";
import useCalculatePositions from "./hooks/useCalculatePositions";

export interface Props {
  /** test */
  children: React.ReactNode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  offset?: number;
  /** Sticky컴포넌트가 mount 됐을때 실행할 callback 함수 */
  onMount?: () => void;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onSticky?: () => void;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnSticky?: () => void;
}

type SinglePosition = number | null;
interface Position {
  top: SinglePosition;
  bottom: SinglePosition;
}

interface StickyStatus {
  isSticky: boolean;
  isAbsolute: boolean;
}

function Sticky({ children, offset = 0, onMount, onSticky, onUnSticky }: Props) {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);
  const [top, setTop] = useState<SinglePosition>(0);
  const [bottom, setBottom] = useState<SinglePosition>(0);

  const { parentRef, findParentFrom } = useClosetParent(".sticky-container");
  const stickyRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const calculatePositionHandlers = useCalculatePositions({ containerRef: parentRef, stickyRef, heightRef, offset });

  const fireStickyCallback = (pIsSticky: boolean) => {
    if (pIsSticky && onSticky) return onSticky();
    if (!pIsSticky && onUnSticky) return onUnSticky();
  };

  /**
   * sticky상태는 다음과 같이 2가지로 다시 나뉨
   * 1) sticky element가 container bottom영역까지 도달하고 위로 서서히 사라질때
   * 2) sticky element가 계속 screen의 상단에 고정되어있을때
   * 1번과 같은 경우는 position: absolute로 바뀌어야함
   * 2번과 같은 경우는 position: fixed로 바뀌어야함
   */
  const setSticky = ({ isSticky: pIsSticky, isAbsolute: pIsAbsolute }: StickyStatus) => {
    setIsSticky(pIsSticky);
    setIsIsAbsolute(pIsAbsolute);
    fireStickyCallback(pIsSticky);
  };

  const setTopAndBottom = ({ top: pTop, bottom: pBottom }: Position) => {
    setTop(pTop);
    setBottom(pBottom);
  };

  // sticky영역이 viewport상단에 고정되었을때 실행 할 함수
  const stickyToScreenTop = () => {
    setTopAndBottom({ top: offset, bottom: null });
    setSticky({ isSticky: true, isAbsolute: false });
  };

  // sticky영역이 container bottom에 도달했을때 실행 할 함수
  const stickyToContainerBottom = () => {
    setSticky({ isSticky: true, isAbsolute: true });
  };

  // sticky영역이 container top에 도달했을때 실행 할 함수
  const stickyToContainerTop = () => {
    setSticky({ isSticky: false, isAbsolute: false });
  };

  /**
   * 현재 sticky element의 상태값을 사용하여 처리하는 함수
   */
  const update = useCallback(() => {
    const handlers = calculatePositionHandlers();
    if (!handlers) return;

    const { isReachContainerBottom, isReachScreenTop } = handlers;

    // sticky element가 상단에 고정되었을때(sticky 상태일때)
    if (isReachScreenTop()) {
      // sticky상태에서 container의 bottom에 도달했을때
      if (isReachContainerBottom()) return stickyToContainerBottom();
      return stickyToScreenTop();
    }

    return stickyToContainerTop();
  }, [calculatePositionHandlers]);

  const handleUpdate = useCallback(() => {
    update();
  }, [update]);

  useEvent("scroll", handleUpdate, { passive: true });
  useEvent("resize", handleUpdate);

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      <div ref={heightRef} className="sticky-height" style={{ position: "fixed" }} />
      <div ref={stickyRef} className="sticky-content">
        {children}
      </div>
    </div>
  );
}

export default Sticky;
