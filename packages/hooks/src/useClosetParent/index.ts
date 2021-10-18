import { useCallback, useRef } from "react";

interface Return {
  parentNode: Element | null;
  findParentFrom: (node: HTMLElement) => void;
}
/**
 * callback으로 등록된 element를 기준으로 가장 가까운 parentSelector를 찾는 hook
 */
const useClosetParent = (parentSelector: string) => {
  const parentRef = useRef<Element | null>();

  const findParentFrom = useCallback(
    (node: HTMLElement) => {
      const stickyParent = node.parentElement?.closest(parentSelector);
      parentRef.current = stickyParent || null;
    },
    [parentSelector],
  );

  return { parentNode: parentRef.current, findParentFrom } as Return;
};

export default useClosetParent;
