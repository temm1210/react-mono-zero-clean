/* eslint-disable react/jsx-props-no-spreading */
import { Story } from "@storybook/react";
import Placeholder from "./Placeholder";
import Sticky, { Props as StickyProps } from "../Sticky";

const BaseWithoutContainerStory: Story<StickyProps> = (args) => {
  const { children, ...rest } = args;

  return (
    <div>
      <div style={{ display: "flex", textAlign: "center" }}>
        <div style={{ flex: 1 }}>
          <Sticky {...rest}>{children}</Sticky>
        </div>
        <div style={{ flex: 1 }}>{Array(20).fill(null).map(Placeholder)}</div>
      </div>
      <div>{Array(10).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default BaseWithoutContainerStory;
