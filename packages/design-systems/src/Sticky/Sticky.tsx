import { useCallback, useRef } from "react";
import { useEvent } from "@project/react-hooks";

export interface Props {
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  offset?: number;
  children: React.ReactNode;
}

function Sticky({ children, offset = 0 }: Props) {
  const stickyContainerRectRef = useRef<DOMRect>();
  const stickyHeightRef = useRef<HTMLDivElement>(null);

  const onUpdate = useCallback(() => {
    console.log("scroll");
  }, []);

  useEvent("scroll", onUpdate, { passive: true });
  useEvent("resize", onUpdate, { passive: true });

  const assignContainerClientRect = useCallback((node: HTMLDivElement) => {
    const stickyContainer = node.parentElement?.closest(".sticky-container") || document.body;
    stickyContainerRectRef.current = stickyContainer.getBoundingClientRect();
  }, []);

  return (
    <div ref={assignContainerClientRect}>
      <div ref={stickyHeightRef} className="sticky-height" />
      <div className="sticky">{children}</div>
    </div>
  );
}

export default Sticky;
