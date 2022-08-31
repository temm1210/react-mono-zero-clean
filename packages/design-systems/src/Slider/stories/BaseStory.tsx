import { Story } from "@storybook/react";
import Slider, { SliderProps } from "../Slider";

const BaseStory: Story<SliderProps> = (props) => {
  return (
    <div style={{ padding: "20px" }}>
      <Slider {...props} />
    </div>
  );
};

export default BaseStory;
