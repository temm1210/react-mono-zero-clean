import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export interface Props {
  /** portal할 부모 element의 class name */
  className?: string;
  children: React.ReactNode;
}

const Portal = ({ className = "portal__container", children }: Props) => {
  const containerElement = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    containerElement.classList.add(className);

    const parent = document.body;

    parent.appendChild(containerElement);
    return () => {
      parent.removeChild(containerElement);
    };
  }, [containerElement, className]);

  return createPortal(children, containerElement);
};

export default Portal;
