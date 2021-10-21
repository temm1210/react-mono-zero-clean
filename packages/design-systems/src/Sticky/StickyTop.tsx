import { forwardRef, useRef, useState, useImperativeHandle } from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import cx from "clsx";
import useCalculatePositions from "./hooks/useCalculatePositions";
import { ChildHandler, StatusHandler } from "./types";

export interface Props {
  children: React.ReactNode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  top: number;
  /** sticky여부 */
  isSticky: boolean;
  /** sticky상태에서의 absolute여부 */
  isAbsolute: boolean;
  /** sticky상태값을 update하는 함수모음 */
  statusHandler: StatusHandler;
  /** sticky엘리먼트의 상태 계산을위한 container element */
  parent: Element;
}

const TopSticky = forwardRef<ChildHandler, Props>(
  ({ children, top, isSticky, isAbsolute, parent, statusHandler }, updateRef) => {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const stickyRef = useRef<HTMLDivElement>(null);
    const heightRef = useRef<HTMLDivElement>(null);

    const calculatePositionHandlers = useCalculatePositions({
      containerRef: parent,
      stickyRef,
      heightRef,
      top,
    });

    const getStickyElement = () => {
      const stickyCurrent = stickyRef.current;
      if (!stickyCurrent) return { width: 0, height: 0 };

      const rect = stickyCurrent.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    };

    const handlerProxy = () => {
      return {
        stickToScreenTop() {
          // https://github.com/facebook/react/issues/10231#issuecomment-316644950
          // scroll event는 react batch작업이 이루어지지 않음
          // 따라서 강제로 batch 실행(unstable_batchedUpdates)
          unstable_batchedUpdates(() => {
            const { width: lWidth, height: lHeight } = getStickyElement();
            setWidth(lWidth);
            setHeight(lHeight);

            statusHandler.stickToScreenTop();
          });
        },

        stickToContainerBottom() {
          unstable_batchedUpdates(() => {
            statusHandler.stickToContainerBottom();
          });
        },

        unStick() {
          unstable_batchedUpdates(() => {
            statusHandler.unStick();
          });
        },
      };
    };

    // 부모에게 위임받아 scroll 이벤트 발생 시 할 일을 상세 구현
    useImperativeHandle(updateRef, () => {
      return {
        update() {
          const positionHandlers = calculatePositionHandlers();
          if (!positionHandlers) return;

          // sticky 상태일때
          if (positionHandlers.isReachScreenTop()) {
            // sticky상태에서 element가 위로 서서히 사라지기 시작할때
            if (positionHandlers.isReachContainerBottomFrom("top")) {
              return handlerProxy().stickToContainerBottom();
            }
            return handlerProxy().stickToScreenTop();
          }

          // sticky 상태가 아닐때
          return handlerProxy().unStick();
        },
      };
    });

    const calculateStickyStyle = () => {
      if (!isSticky) return;
      return {
        top: isAbsolute ? undefined : top,
        bottom: isAbsolute ? 0 : undefined,
        width,
      };
    };

    const stickyClassNames = cx(
      !isSticky && "sticky__content",
      isSticky && (isAbsolute ? "sticky__content--absolute" : "sticky__content--fixed"),
    );

    const heightStyle = isSticky || isAbsolute ? { height } : { height: 0 };

    return (
      <div className="sticky-top">
        {/* 바로아래 sticky element가 fixed일시 실질적인 height값이 없어져서 전체 레이아웃이 깨지는걸방지 */}
        <div ref={heightRef} className="sticky__height" style={heightStyle} />
        <div ref={stickyRef} className={stickyClassNames} style={calculateStickyStyle()}>
          {children}
        </div>
      </div>
    );
  },
);

export default TopSticky;
