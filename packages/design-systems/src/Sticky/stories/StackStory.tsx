/* eslint-disable react/jsx-props-no-spreading */
import { Story } from "@storybook/react";
import Placeholder from "./Placeholder";
import Sticky, { Props as StickyProps } from "../Sticky";
import StickyContainer from "../StickyContainer";

const StackStory: Story<StickyProps> = (args) => {
  const { children } = args;

  return (
    <div>
      <div style={{ display: "flex", textAlign: "center" }}>
        <div style={{ flex: 1 }}>
          <Sticky>{children}</Sticky>
        </div>
        <div style={{ flex: 1 }}>{Array(20).fill(null).map(Placeholder)}</div>
      </div>

      <StickyContainer>
        <div style={{ flex: 1 }}>{Array(15).fill(null).map(Placeholder)}</div>
        <Sticky>{children}</Sticky>
        <div style={{ flex: 1 }}>{Array(10).fill(null).map(Placeholder)}</div>
      </StickyContainer>

      <div>{Array(10).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default StackStory;
