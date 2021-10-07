import { Story } from "@storybook/react";
import Sticky, { Props as StickyProps } from "../Sticky";
import StickyContainer from "../StickyContainer";

const Placeholder = () => <div style={{ margin: "50px 0" }}>placeholder</div>;

const BaseStory: Story<StickyProps> = (args) => {
  const { offset, children } = args;
  return (
    <div>
      <div>{Array(15).fill(null).map(Placeholder)}</div>
      <StickyContainer>
        <div>{Array(5).fill(null).map(Placeholder)}</div>
        <Sticky offset={offset}>{children}</Sticky>
        <div>{Array(15).fill(null).map(Placeholder)}</div>
        {/* <Sticky offset={offset}>{children}</Sticky> */}
      </StickyContainer>
    </div>
  );
};

export default BaseStory;
