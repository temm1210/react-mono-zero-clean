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
  /** Modal의 overlay className(overlay style지정) */
  overlayClassName?: string;
  /** Modal의 portal class name */
  portalName?: string;
}

const CloseIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M13 14L26 27" stroke="#202327" stroke-width="2" stroke-linecap="round" />
      <path d="M26 14L13 27" stroke="#202327" stroke-width="2" stroke-linecap="round" />
    </svg>
  );
};

const Modal = ({ isOpen, children, onClose, overlayClassName, portalName = "modal-portal" }: Props) => {
  const [isEndAnimation, setIsEndAnimation] = useState(false);
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
    "modal-content__body",
    isEndAnimation && isOpen ? "modal-content__body--open" : "modal-content__body--close",
  );

  const overlayClassNames = cx("modal-content", overlayClassName);

  return (
    <>
      {(isOpen || isEndAnimation) && (
        <Portal className={portalName}>
          <div className="modal-container">
            <div className={overlayClassNames} onClick={onClick}>
              <div ref={contentRef} className={contentClassNames}>
                <div>
                  <CloseIcon />
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
