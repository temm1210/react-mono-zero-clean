import Portal from "Portal";

export interface Props {
  children: React.ReactNode;
  /** Modal의 open여부 */
  isOpen: boolean;
}

const Modal = ({ isOpen, children }: Props) => {
  console.log("isOpen:", isOpen);
  return <>{isOpen && <Portal className="modal-portal__container">testset{children}</Portal>}</>;
};

export default Modal;
