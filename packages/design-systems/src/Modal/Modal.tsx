import { useEffect, useState, useCallback, MouseEvent, useRef } from "react";
import Portal from "Portal";
import cx from "clsx";
import { useEvent } from "@project/react-hooks";
import "./Modal.scss";

export interface Props {
  children: React.ReactNode;
  /** Modal의 open여부 */
  isOpen: boolean;
  /** Modal을 close하는 함수 */
  onClose: () => void;
  /** Modal의 overlay color */
  overlayColor?: string;
  /** Modal의 portal class name */
  portalName?: string;
}

const Modal = ({ isOpen, children, onClose, overlayColor, portalName = "modal-portal" }: Props) => {
  const [isEndAnimation, setIsEndAnimation] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const onTransitionEnd = useCallback(() => {
    setIsEndAnimation(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(onTransitionEnd, 30);
  }, [isOpen, onTransitionEnd]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEvent("transitionend", onTransitionEnd);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === contentRef.current) {
      onClose();
    }
  };

  const contentClassNames = cx(
    "modal-content",
    isEndAnimation && isOpen ? "modal-content--open" : "modal-content--close",
  );

  return (
    <>
      {(isOpen || isEndAnimation) && (
        <Portal className={portalName}>
          <div className="modal-container">
            <div ref={overlayRef} style={{ backgroundColor: overlayColor }} className="modal-overlay" onClick={onClick}>
              <div ref={contentRef} className={contentClassNames}>
                {children}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
