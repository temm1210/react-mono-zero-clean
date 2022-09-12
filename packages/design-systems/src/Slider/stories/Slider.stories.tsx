import { Meta } from "@storybook/react";
import Slider from "../Slider";
import BaseStory from "./BaseStory";

export default {
  component: Slider,
  title: "Design Systems/Slider",
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: 400,
    },
  },
} as Meta;

export const Base = BaseStory.bind({});
Base.args = {
  onChange: (value: number) => console.log("value:", value),
};

export const StepSlider = BaseStory.bind({});
StepSlider.args = {
  step: 20,
  onChange: (value: number) => console.log("value:", value),
};

export const VerticalSlider = BaseStory.bind({});
VerticalSlider.args = {
  orientation: "vertical",
  max: 95,
  step: 10,
  size: "150px",
  onChange: (value: number) => console.log("value:", value),
};
