import { useCallback, useState } from "react";

type ParentNode = Element | null;
type FindParentFrom = (node: HTMLElement | null) => void;

interface Return {
  parentNode: ParentNode;
  findParentFrom: FindParentFrom;
}
/**
 * callback으로 등록된 element를 기준으로 가장 가까운 parentSelector를 찾는 hook
 */
const useClosetParent = (parentSelector: string) => {
  const [parentNode, setParentNode] = useState<Element | null>();

  const findParentFrom: FindParentFrom = useCallback(
    (node: HTMLElement | null) => {
      const stickyParent = node?.parentElement?.closest(parentSelector);
      console.log("stickyParent:", stickyParent);
      setParentNode(stickyParent || null);
    },
    [parentSelector],
  );

  return { parentNode, findParentFrom } as Return;
};

export default useClosetParent;
