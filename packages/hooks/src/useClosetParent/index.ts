import { useCallback, useState } from "react";

export type ParentNode = Element | null;
export type FindParentFrom = (node: ParentNode) => void;

export interface UseClosetParentReturn {
  parentNode: ParentNode;
  findParentFrom: FindParentFrom;
}
/**
 * callback으로 등록된 element를 기준으로 가장 가까운 parentSelector를 찾는 hook
 */
const useClosetParent = (parentSelector: string) => {
  const [parentNode, setParentNode] = useState<ParentNode>();

  const findParentFrom: FindParentFrom = useCallback(
    (node) => {
      const stickyParent = node?.parentElement?.closest(parentSelector);
      setParentNode(stickyParent || null);
    },
    [parentSelector],
  );

  return { parentNode, findParentFrom } as UseClosetParentReturn;
};

export default useClosetParent;
