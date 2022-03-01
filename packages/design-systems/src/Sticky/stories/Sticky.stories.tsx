import { Meta } from "@storybook/react";
import { Title, Subtitle, Description, Primary, ArgsTable, PRIMARY_STORY } from "@storybook/addon-docs";
import { Sticky, StickyContainer } from "../index";
import BaseStory from "./BaseStory";
import PushStory from "./PushStory";
import BottomStory from "./BottomStory";
import WithoutContainerStory from "./WithoutContainerStory";
import StackStory from "./StackStory";

export default {
  component: StickyContainer,
  subcomponents: { Sticky },
  title: "Design Systems/Sticky",
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 400,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
        </>
      ),
    },
  },
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
  onStick: (rect) => console.log("onSticky:", rect),
  onUnStick: (rect) => console.log("onUnSticky:", rect),
  top: 20,
  children: <Children />,
};

export const BaseWithoutContainer = WithoutContainerStory.bind({});
BaseWithoutContainer.args = {
  onStick: (rect) => console.log("onSticky:", rect),
  onUnStick: (rect) => console.log("onUnSticky:", rect),
  top: 30,
  children: <Children />,
};

export const BottomWithoutContainer = WithoutContainerStory.bind({});
BottomWithoutContainer.args = {
  onStick: (rect) => console.log("onSticky:", rect),
  onUnStick: (rect) => console.log("onUnSticky:", rect),
  mode: "bottom",
  bottom: 20,
  children: <Children />,
};

export const Bottom = BottomStory.bind({});
Bottom.args = {
  onStick: (rect) => console.log("onSticky:", rect),
  onUnStick: (rect) => console.log("onUnSticky:", rect),
  mode: "bottom",
  bottom: 20,
  children: <Children />,
};

export const Push = PushStory.bind({});
export const Stack = StackStory.bind({});
Stack.args = {
  children: <Children />,
};
