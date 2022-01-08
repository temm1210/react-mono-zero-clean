import { useState } from "react";
import { Story } from "@storybook/react";
import Modal, { Props as ModalProps } from "../Modal";

const CloseIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <path d="M13 14L26 27" stroke="#202327" stroke-width="1" stroke-linecap="round" />
      <path d="M26 14L13 27" stroke="#202327" stroke-width="1" stroke-linecap="round" />
    </svg>
  );
};

const BaseStory: Story<ModalProps> = ({ overlayColor }) => {
  const [isOpen2, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={openModal}>
        open modal
      </button>

      <Modal isOpen={isOpen2} onClose={closeModal} overlayColor={overlayColor}>
        <div style={{ backgroundColor: "white" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "inline-block", paddingRight: "5px", cursor: "pointer" }} onClick={closeModal}>
              <CloseIcon />
            </div>
          </div>
          <div style={{ padding: "5px" }}>Modal Content</div>
        </div>
      </Modal>

      <div style={{ height: "600px" }} />
    </div>
  );
};

export default BaseStory;
