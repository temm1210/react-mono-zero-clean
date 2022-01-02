import { useEffect, useState, useCallback } from "react";
import Portal from "Portal";
import cx from "clsx";
import { useEvent } from "@project/react-hooks";
import "./Modal.scss";

export interface Props {
  children: React.ReactNode;
  /** Modal의 open여부 */
  isOpen: boolean;
}

const Modal = ({ isOpen, children }: Props) => {
  const [isEndAnimation, setIsEndAnimation] = useState(false);

  const onTransitionEnd = useCallback(() => {
    setIsEndAnimation(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(onTransitionEnd, 50);
  }, [isOpen, onTransitionEnd]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEvent("transitionend", onTransitionEnd);

  const contentClassNames = cx(
    "modal-content__body",
    isEndAnimation && isOpen ? "modal-content__body--open" : "modal-content__body--close",
  );

  return (
    <>
      {(isOpen || isEndAnimation) && (
        <Portal className="modal-portal">
          <div className="modal-container">
            <div className="modal-content">
              <div className={contentClassNames}>{children}</div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
