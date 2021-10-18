import { Meta } from "@storybook/react";
import { Sticky, StickyContainer } from "../index";
import BaseStory from "./BaseStory";
import PushStory from "./PushStory";

export default {
  component: StickyContainer,
  subcomponents: { Sticky },
  title: "Design Systems/Sticky",
} as Meta;

export const Base = BaseStory.bind({});
Base.args = {
  top: 10,
  children: (
    <div style={{ backgroundColor: "#2ecc71" }}>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
    </div>
  ),
};

export const Push = PushStory.bind({});
