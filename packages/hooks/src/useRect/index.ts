import { useState } from "react";

export type UseClientRect = Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "height" | "width">;

export type UseRectRef<E extends Element = Element> = (element: E | null) => void;
export type UseRectResult<E extends Element = Element> = [UseRectRef<E>, () => UseClientRect];

const defaultState: UseClientRect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const useRect = <F extends Element>(): UseRectResult<F> => {
  const [element, ref] = useState<Element | null>(null);

  const getRect = () => element?.getBoundingClientRect() || defaultState;

  return [ref, getRect];
};

export default useRect;
