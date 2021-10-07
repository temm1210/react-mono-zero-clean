import { Meta } from "@storybook/react";
import { Sticky, StickyContainer } from "../index";
import BaseStory from "./BaseStory";

export default {
  component: StickyContainer,
  subcomponents: { Sticky },
  title: "Design Systems/Sticky",
} as Meta;

export const Base = BaseStory.bind({});
Base.args = {
  offset: 10,
  children: (
    <div style={{ backgroundColor: "#b2bec3" }}>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
      <div>sticky</div>
    </div>
  ),
};
