/* eslint-disable react/jsx-props-no-spreading */
import { Story } from "@storybook/react";
import { Sticky, Props as StickyProps } from "..";
import StickyContainer from "../StickyContainer";

const Placeholder = () => <div style={{ padding: "20px 0" }}>placeholder</div>;

const BaseStory: Story<StickyProps> = (args) => {
  const { children, ...rest } = args;

  return (
    <div>
      <StickyContainer>
        <div>{Array(10).fill(null).map(Placeholder)}</div>
        <Sticky {...rest}>{children}</Sticky>
        <div>{Array(10).fill(null).map(Placeholder)}</div>
      </StickyContainer>

      <div style={{ backgroundColor: "#dcdde1" }}>{Array(7).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default BaseStory;
