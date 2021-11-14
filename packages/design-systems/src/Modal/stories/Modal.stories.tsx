import { Meta } from "@storybook/react";
import BaseStory from "./BaseStory";
import Modal from "../Modal";

export default {
  component: Modal,
  title: "Design Systems/Modal",
} as Meta;

const Children = () => {
  return <div style={{ backgroundColor: "#2ecc71" }}>Modal Content</div>;
};

export const Base = BaseStory.bind({});
Base.args = {
  children: <Children />,
};
