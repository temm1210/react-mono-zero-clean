import { useState, useMemo } from "react";
import { StatusHandler } from "../types";

interface Props {
  /** Sticky컴포넌트가 sticky 됐을때 실행할 callback 함수 */
  onStick?: () => void;
  /** Sticky컴포넌트가 unSticky 됐을때 실행할 callback 함수 */
  onUnStick?: () => void;
}

/**
 * sticky component의 기본 명세서
 */
const useStatement = ({ onStick, onUnStick }: Props) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsIsAbsolute] = useState(false);

  /**
   * sticky상태는 다음과 같이 2가지로 다시 나뉨
   * 1) sticky element가 container bottom영역까지 도달하고 위로 서서히 사라질때
   * 2) sticky element가 계속 screen의 상단에 고정되어있을때
   * 1번과 같은 경우는 position: absolute로 바뀌어야함
   * 2번과 같은 경우는 position: fixed로 바뀌어야함
   */
  const statusHandler: StatusHandler = useMemo(
    () => ({
      stickToScreenTop() {
        setIsSticky(true);
        setIsIsAbsolute(false);
        onStick?.();
      },

      // container bottom를 기준으로해서 sticky를 고정
      stickToContainerBottom() {
        setIsSticky(true);
        setIsIsAbsolute(true);
        onStick?.();
      },

      stickyToScreenBottom() {
        setIsSticky(true);
        setIsIsAbsolute(false);
        onStick?.();
      },

      unStick() {
        setIsSticky(false);
        setIsIsAbsolute(false);
        onUnStick?.();
      },
    }),
    [onStick, onUnStick],
  );

  return { isSticky, isAbsolute, statusHandler };
};

export default useStatement;
