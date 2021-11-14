import React from "react";
import Portal from "Portal";

export interface Props {
  children: React.ReactNode;
  /** Modal의 open여부 */
  isOpen: boolean;
}

const Modal = ({ isOpen, children }: Props) => {
  console.log("isOpen:", isOpen);
  return <Portal portalClassName="modal-portal__container">{children}</Portal>;
};

export default Modal;
