import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export interface Props {
  /** portal할 부모 element의 class name */
  portalClassName?: string;
  children: React.ReactNode;
}

const Portal = ({ portalClassName = "portal__container", children }: Props) => {
  const portalContainerElement = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    portalContainerElement.classList.add(portalClassName);
  }, [portalContainerElement, portalClassName]);

  return createPortal(children, portalContainerElement);
};

export default Portal;
