/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { Story } from "@storybook/react";
import Modal, { Props as ModalProps } from "../Modal";

const BaseStory: Story<ModalProps> = (args) => {
  const { children } = args;
  const [isOpen, setIsOpen] = useState(false);

  const onOpenClick = () => {
    setIsOpen(true);
  };
  return (
    <div>
      <button type="button" onClick={onOpenClick}>
        modal open
      </button>
      <Modal isOpen={isOpen}>{children}</Modal>
    </div>
  );
};

export default BaseStory;
