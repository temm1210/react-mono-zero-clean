import { Story } from "@storybook/react";
import Placeholder from "./Placeholder";
import Sticky, { Props as StickyProps } from "../Sticky";
import StickyContainer from "../StickyContainer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Children = ({ backgroundColor }: any) => {
  return (
    <div style={{ backgroundColor }}>
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
const BaseStory: Story<StickyProps> = () => {
  return (
    <div>
      <StickyContainer>
        <div>{Array(8).fill(null).map(Placeholder)}</div>
        <Sticky>
          <Children backgroundColor="#2ecc71" />
        </Sticky>
        <div>{Array(10).fill(null).map(Placeholder)}</div>
      </StickyContainer>

      <StickyContainer>
        <Sticky>
          <Children backgroundColor="#1abc9c" />
        </Sticky>
        <div>{Array(15).fill(null).map(Placeholder)}</div>
      </StickyContainer>

      <div>{Array(15).fill(null).map(Placeholder)}</div>
    </div>
  );
};

export default BaseStory;
