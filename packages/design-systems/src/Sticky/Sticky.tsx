import { useCallback, useEffect, useRef, useState } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import cx from "clsx";
import { useEvent, useClosetParent } from "@project/react-hooks";
import useCalculatePositions from "./hooks/useCalculatePositions";
import { StickyHandler } from "./types";
import PARENT_SELECTOR from "./parentSelector";
import "./Sticky.scss";

export interface Props {
  children: React.ReactNode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top?: number;
  /** 하단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  bottom?: number;
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: () => void;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: () => void;
}

function Sticky({ children, top = 0, bottom = 0, onStick, onUnStick }: Props) {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);

  // const [top, setTop] = useState<SinglePosition>(0);
  // const [bottom, setBottom] = useState<SinglePosition>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const { parentRef, findParentFrom } = useClosetParent(PARENT_SELECTOR);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);
  const calculatePositionHandlers = useCalculatePositions({
    containerRef: parentRef,
    stickyRef,
    heightRef,
    top,
    bottom,
  });

  const stickyHandlerRef = useRef<StickyHandler>();

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

  // const handleUpdate = useCallback(() => {
  //   update();
  // }, [update]);

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

  const setWidthAndHeight = (pWidth: number, pHeight: number) => {
    setWidth(pWidth);
    setHeight(pHeight);
  };

  const getStickyElement = () => {
    const stickyCurrent = stickyRef.current;
    if (!stickyCurrent) return { width: 0, height: 0 };
    const rect = stickyCurrent.getBoundingClientRect();

    return { width: rect.width, height: rect.height };
  };

  useEffect(() => {
    if (!stickyHandlerRef) return;

    stickyHandlerRef.current = {
      // sticky영역을 현재 screen(viewport)상단에 고정
      stickToScreenTop: () => {
        const { width: pWidth, height: pHeight } = getStickyElement();

        // https://github.com/facebook/react/issues/10231#issuecomment-316644950
        // react 강제 batch
        unstable_batchedUpdates(() => {
          setStickyAndAbsolute(true, false);
          setWidthAndHeight(pWidth, pHeight);
        });

        onStick?.();
      },

      // container bottom를 기준으로해서 sticky를 고정
      stickToContainerBottom: () => {
        const { width: pWidth, height: pHeight } = getStickyElement();

        unstable_batchedUpdates(() => {
          setStickyAndAbsolute(true, true);
          setWidthAndHeight(pWidth, pHeight);
        });
        onStick?.();
      },

      unStick: () => {
        unstable_batchedUpdates(() => {
          setStickyAndAbsolute(false, false);
        });

        onUnStick?.();
      },
    };
  }, [onStick, onUnStick]);

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  const calculateStyle = () => {
    if (!isSticky) return;

    return {
      top: isAbsolute ? undefined : top,
      bottom: isAbsolute ? 0 : undefined,
      width,
    };
  };

  const stickyClassNames = cx(
    !isSticky && "sticky-content",
    isSticky && (isAbsolute ? "sticky-content__absolute" : "sticky-content__fixed"),
  );

  const heightStyle = isSticky || isAbsolute ? { height } : { height: 0 };

  return (
    <div ref={findParentFrom} className="sticky-wrap">
      {/* 바로아래 sticky element가 fixed일시 실질적인 height값이 없어져서 전체 레이아웃이 깨지는걸방지 */}
      <div ref={heightRef} className="sticky-height" style={heightStyle} />
      <div ref={stickyRef} className={stickyClassNames} style={calculateStyle()}>
        {children}
      </div>
    </div>
  );
}

export default Sticky;
