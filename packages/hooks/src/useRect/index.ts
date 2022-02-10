import { useEffect, useState } from "react";

type Rect = Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "height" | "width">;

export type UseRectRef<E> = (element: E) => void;
export type UseRectResult<E> = [UseRectRef<E>, Rect];

const defaultState: Rect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const useRect = <F extends Element>(): UseRectResult<F> => {
  const [element, ref] = useState<Element | null>(null);
  const [rect, setRect] = useState<Rect>(defaultState);

  useEffect(() => {
    if (element) {
      setRect(element.getBoundingClientRect());
    }
  }, [element]);

  return [ref, rect];
};

export default useRect;
