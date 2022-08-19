import { Meta } from "@storybook/react";
import Slider from "../Slider";

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

export const Base = Slider.bind({});
