import { Meta } from "@storybook/react";
import BaseStory from "./BaseStory";
import Modal from "../Modal";

export default {
  component: Modal,
  title: "Design Systems/Modal",
} as Meta;

export const Base = BaseStory.bind({});
Base.args = {
  overlayColor: "rgba(0, 0, 0, 0.4)",
};
