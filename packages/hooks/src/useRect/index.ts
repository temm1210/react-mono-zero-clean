import { useState } from "react";

export type UseClientRect = Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "height" | "width"> | null;

export type UseRectRef<E extends Element = Element> = (element: E | null) => void;
export type UseRectResult<E extends Element = Element> = [UseRectRef<E>, () => UseClientRect];

const useRect = <F extends Element>(): UseRectResult<F> => {
  const [element, ref] = useState<Element | null>(null);

  const getRect = () => element?.getBoundingClientRect() || null;

  return [ref, getRect];
};

export default useRect;
