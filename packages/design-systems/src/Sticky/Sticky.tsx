import { useCallback, useRef } from "react";
import { useEvent } from "@project/react-hooks";

export interface Props {
  /** test */
  children: React.ReactNode;
  /** 상단에서 얼마나 떨어진 상태로 sticky가 진행될지 결정 */
  offset?: number;
}

function Sticky({ children, offset = 0 }: Props) {
  const containerRef = useRef<Element>();

  // const [isSticky, setIsSticky] = useState(false);
  // sticky상태에서 context의 bottom에 도달했는지 여부를 체크하는 값
  // const [isReachBottom, setIsReachBottom] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const onUpdate = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const heightRect = heightRef.current?.getBoundingClientRect();
    const stickyRect = stickyRef.current?.getBoundingClientRect();

    if (!containerRect || !heightRect || !stickyRect) return;

    // sticky영역이 위로 올라가는 시점
    // viewport에서 container의 위치가 sticky element의 높이보다 작아질때
    const isReachContainerBottom = () => {
      return stickyRect?.height + offset >= containerRect?.bottom;
    };

    // sticky영역이 현재 viewport상단에 고정되는 시점(offset이 주어지면 그만큼 떨어진상태로 고정)
    const isReachScreenTop = () => {
      return heightRect.top < offset;
    };

    console.log("isReachContainerBottom():", isReachContainerBottom());
    console.log("isReachScreenTop():", isReachScreenTop());
  }, [offset]);

  const assignContainerClientRect = useCallback((node: HTMLDivElement) => {
    const stickyContainer = node.parentElement?.closest(".sticky-container") || document.body;
    containerRef.current = stickyContainer;
  }, []);

  useEvent("scroll", onUpdate, { passive: true });
  useEvent("resize", onUpdate);

  return (
    <div ref={assignContainerClientRect}>
      <div ref={heightRef} className="sticky-height" />
      <div ref={stickyRef} className="sticky">
        {children}
      </div>
    </div>
  );
}

export default Sticky;
