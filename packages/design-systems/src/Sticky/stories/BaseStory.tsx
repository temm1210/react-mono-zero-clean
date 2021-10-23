/* eslint-disable react/jsx-props-no-spreading */
import { Story } from "@storybook/react";
import Sticky, { Props as StickyProps } from "../Sticky";
import StickyContainer from "../StickyContainer";
import Placeholder from "./Placeholder";

const BaseStory: Story<StickyProps> = (args) => {
  const { children, ...rest } = args;

  return (
    <div>
      <div style={{ flex: 1 }}>{Array(10).fill(null).map(Placeholder)}</div>
      <StickyContainer>
        <div style={{ display: "flex", textAlign: "center" }}>
          <div style={{ flex: 1 }}>
            <Sticky {...rest}>{children}</Sticky>
          </div>
          <div style={{ flex: 1 }}>{Array(20).fill(null).map(Placeholder)}</div>
        </div>
      </StickyContainer>

      <div>{Array(10).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default BaseStory;
