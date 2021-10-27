/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { Story } from "@storybook/react";
import Placeholder from "./Placeholder";
import { CallbackParameter } from "../hooks/useUpdate";
import Sticky, { Props as StickyProps } from "../Sticky";
import StickyContainer from "../StickyContainer";

const StackStory: Story<StickyProps> = (args) => {
  const { children } = args;

  const [offset, setOffset] = useState(0);

  const onStick = ({ top, height }: CallbackParameter) => {
    const offsetFromFirstStickyElement = top + height;
    setOffset(offsetFromFirstStickyElement);
  };

  return (
    <div>
      <div style={{ display: "flex", textAlign: "center" }}>
        <div style={{ flex: 1 }}>
          <Sticky onStick={onStick}>{children}</Sticky>
        </div>
        <div style={{ flex: 1 }}>{Array(20).fill(null).map(Placeholder)}</div>
      </div>

      <StickyContainer>
        <div style={{ flex: 1 }}>{Array(15).fill(null).map(Placeholder)}</div>
        <Sticky top={offset}>{children}</Sticky>
        <div style={{ flex: 1 }}>{Array(10).fill(null).map(Placeholder)}</div>
      </StickyContainer>

      <div>{Array(10).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default StackStory;
