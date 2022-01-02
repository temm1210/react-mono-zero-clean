/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { Story } from "@storybook/react";
import Modal, { Props as ModalProps } from "../Modal";

const BaseStory: Story<ModalProps> = (args) => {
  const { children } = args;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const openModal2 = () => {
    setIsOpen2(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeModal2 = () => {
    setIsOpen2(false);
  };

  console.log(isOpen);
  return (
    <div>
      <button type="button" onClick={openModal}>
        open modal
      </button>

      <button type="button" onClick={closeModal}>
        close modal
      </button>

      <button type="button" onClick={openModal2}>
        open modal2
      </button>

      <button type="button" onClick={closeModal2}>
        close modal2
      </button>
      <Modal isOpen={isOpen}>{children}</Modal>
      <Modal isOpen={isOpen2}>{children}</Modal>
    </div>
  );
};

export default BaseStory;
