import { useEffect } from "react";
import { createPortal } from "react-dom";
import usePortalElement from "./hooks/usePortalElement";

export interface Props {
  /** portal할 부모 element의 class name */
  className?: string;
  children: React.ReactNode;
}

const Portal = ({ className = "portal-container", children }: Props) => {
  const { portalElement, isExistParent } = usePortalElement(className);

  useEffect(() => {
    if (isExistParent || !portalElement) return;

    document.body.appendChild(portalElement);
    return () => {
      document.body.removeChild(portalElement);
    };
  }, [isExistParent, portalElement]);

  return portalElement && createPortal(children, portalElement);
};

export default Portal;
