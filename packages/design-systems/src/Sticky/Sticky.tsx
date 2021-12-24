import { useCallback, useState } from "react";
import { useEvent } from "@project/react-hooks";
import { StickyMode } from "./types";
import { useStickyMode, useStyles } from "./hooks";
import { Callback, CallbackParameter } from "./hooks/useStickyMode";
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
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // 상대가 sticky로 변할 때 실행할 callback
  const handleOnStick = useCallback(
    (rect: CallbackParameter) => {
      const { width: pWidth, height: pHeight } = rect;

      setWidth(pWidth);
      setHeight(pHeight);
      onStick?.(rect);
    },
    [onStick],
  );

  // 상태가 unSticky로 변할 때 실행할 callback
  const handleOnUnStick = useCallback(
    (rect: CallbackParameter) => {
      const { width: pWidth } = rect;

      setWidth(pWidth);
      setHeight(0);
      onUnStick?.(rect);
    },
    [onUnStick],
  );

  // TODO: position값과 handler 분리해서 parameter로 보내는 방법 check
  const { stickyModeMapper, isAbsolute, isSticky } = useStickyMode({
    top,
    bottom,
    onStick: handleOnStick,
    onUnStick: handleOnUnStick,
  });

  const stickyMapper = stickyModeMapper[mode];

  // scroll event에 등록할 handler
  const update = () => {
    const { isStick, unStick, isReachContainerBottomToMode, stickyToContainerBottom, stickyToModeOfScreen } =
      stickyMapper;

    if (isStick()) {
      if (isReachContainerBottomToMode()) {
        return stickyToContainerBottom();
      }
      return stickyToModeOfScreen();
    }
    return unStick();
  };

  useEvent("scroll", update, { passive: true });
  useEvent("resize", update);

  // TODO: style위치 check
  const { fakeStyle, stickyClassNames, calculateStickyStyle } = useStyles({
    mode,
    isSticky,
    isAbsolute,
    width,
    height,
    top,
    bottom,
  });

  return stickyMapper.render({ fakeStyle, stickyClassNames, calculateStickyStyle, children });
};

export default Sticky;
