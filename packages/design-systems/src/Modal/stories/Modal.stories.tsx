import { Meta } from "@storybook/react";
import BaseStory from "./BaseStory";
import Modal from "../Modal";

export default {
  component: Modal,
  title: "Design Systems/Modal",
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 400,
    },
  },
  // isOpen과, portalName은 storybook control에서 조작금지
  argTypes: {
    isOpen: {
      control: false,
    },
    portalName: {
      control: false,
    },
  },
} as Meta;

export const Base = BaseStory.bind({});
Base.args = {
  overlayColor: "rgba(0, 0, 0, 0.4)",
};
