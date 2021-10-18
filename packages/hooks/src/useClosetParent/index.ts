import { useCallback, useRef, MutableRefObject } from "react";

type ParentRef = MutableRefObject<Element | null>;
type FindParentFrom = (node: HTMLElement | null) => void;

interface Return {
  parentRef: ParentRef;
  findParentFrom: FindParentFrom;
}
/**
 * callback으로 등록된 element를 기준으로 가장 가까운 parentSelector를 찾는 hook
 */
const useClosetParent = (parentSelector: string) => {
  const parentRef = useRef<Element | null>();

  const findParentFrom: FindParentFrom = useCallback(
    (node: HTMLElement | null) => {
      const stickyParent = node?.parentElement?.closest(parentSelector);
      parentRef.current = stickyParent || null;
    },
    [parentSelector],
  );

  return { parentRef, findParentFrom } as Return;
};

export default useClosetParent;
