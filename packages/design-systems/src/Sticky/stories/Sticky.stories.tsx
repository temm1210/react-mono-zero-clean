import { Meta } from "@storybook/react";
import { Sticky, StickyContainer } from "../index";
import BaseStory from "./BaseStory";
import PushStory from "./PushStory";
import BottomStory from "./BottomStory";
import BaseWithoutContainerStory from "./BaseWithoutContainerStory";
import StackStory from "./StackStory";

export default {
  component: StickyContainer,
  subcomponents: { Sticky },
  title: "Design Systems/Sticky",
} as Meta;

const Children = () => {
  return (
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
  );
};

export const Base = BaseStory.bind({});
Base.args = {
  top: 20,
  children: <Children />,
};

export const BaseWithoutContainer = BaseWithoutContainerStory.bind({});
BaseWithoutContainer.args = {
  top: 30,
  children: <Children />,
};

export const Bottom = BottomStory.bind({});
Bottom.args = {
  mode: "bottom",
  bottom: 20,
  children: <Children />,
};

export const Push = PushStory.bind({});
export const Stack = StackStory.bind({});
Stack.args = {
  children: <Children />,
};
