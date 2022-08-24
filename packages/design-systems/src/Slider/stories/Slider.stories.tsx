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

const Test = () => (
  <div style={{ padding: "20px" }}>
    <Slider />
  </div>
);
export const Base = Test.bind({});
