import { useCallback, useEffect, useRef, useState } from "react";
import cx from "clsx";
import { useEvent, useClosetParent } from "@project/react-hooks";
import useCalculatePositions from "./hooks/useCalculatePositions";
import { SinglePosition, StickyHandler } from "./types";
import PARENT_SELECTOR from "./parentSelector";

export interface Props {
  /** test */
  children: React.ReactNode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  offset?: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: () => void;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: () => void;
}

function Sticky({ children, offset = 0, onStick, onUnStick }: Props) {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);
  const [top, setTop] = useState<SinglePosition>(0);
  const [bottom, setBottom] = useState<SinglePosition>(0);

  const { parentRef, findParentFrom } = useClosetParent(PARENT_SELECTOR);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const stickyHandlerRef = useRef<StickyHandler>();
  const calculatePositionHandlers = useCalculatePositions({ containerRef: parentRef, stickyRef, heightRef, offset });

  /**
   * 현재 sticky element의 상태값을 사용하여 처리하는 함수
   */
  const update = useCallback(() => {
    const positionHandlers = calculatePositionHandlers();
    if (!positionHandlers || !stickyHandlerRef) return;
    const stickyHandler = stickyHandlerRef.current;

    const { isReachContainerBottom, isReachScreenTop } = positionHandlers;

    // sticky 상태일때
    if (isReachScreenTop()) {
      if (isReachContainerBottom()) return stickyHandler?.stickToContainerBottom();
      return stickyHandler?.stickToScreenTop();
    }

    return stickyHandler?.unStick();
  }, [calculatePositionHandlers]);

  const handleUpdate = useCallback(() => {
    update();
  }, [update]);

  /**
   * sticky상태는 다음과 같이 2가지로 다시 나뉨
   * 1) sticky element가 container bottom영역까지 도달하고 위로 서서히 사라질때
   * 2) sticky element가 계속 screen의 상단에 고정되어있을때
   * 1번과 같은 경우는 position: absolute로 바뀌어야함
   * 2번과 같은 경우는 position: fixed로 바뀌어야함
   */
  const setStickyAndAbsolute = (pIsSticky: boolean, pIsAbsolute: boolean) => {
    setIsSticky(pIsSticky);
    setIsIsAbsolute(pIsAbsolute);
  };

  const setTopAndBottom = (pTop: SinglePosition, pBottom: SinglePosition) => {
    setTop(pTop);
    setBottom(pBottom);
  };

  useEffect(() => {
    if (!stickyHandlerRef) return;

    stickyHandlerRef.current = {
      // sticky영역을 현재 screen(viewport)상단에 고정
      stickToScreenTop: () => {
        setTopAndBottom(offset, null);
        setStickyAndAbsolute(true, false);
        onStick?.();
      },

      // container bottom를 기준으로해서 sticky를 고정
      stickToContainerBottom: () => {
        setStickyAndAbsolute(true, true);
        onStick?.();
      },

      unStick: () => {
        setStickyAndAbsolute(false, false);
        onUnStick?.();
      },
    };
  }, [offset, onStick, onUnStick]);

  useEvent("scroll", handleUpdate, { passive: true });
  useEvent("resize", handleUpdate);

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      <div ref={heightRef} className="sticky-height" />
      <div ref={stickyRef} className="sticky-content">
        {children}
      </div>
    </div>
  );
}

export default Sticky;
