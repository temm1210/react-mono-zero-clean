import { useCallback, useRef } from "react";

/**
 * callback으로 등록된 element를 기준으로 가장 가까운 parentSelector를 찾는 hook
 */
function useClosetParent(parentSelector: string) {
  const parentRef = useRef<Element>();

  const assignParent = useCallback(
    (node: HTMLDivElement) => {
      const stickyParent = node.parentElement?.closest(parentSelector) || document.body;
      parentRef.current = stickyParent;
    },
    [parentSelector],
  );

  return { parentRef, assignParent };
}

export default useClosetParent;
