import { Sticky, StickyContainer } from "../index";

const Placeholder = () => <div style={{ margin: "50px 0" }}>placeholder</div>;

const BaseStory = () => {
  return (
    <StickyContainer>
      <div>{Array(5).fill(null).map(Placeholder)}</div>
      <Sticky>
        <div style={{ backgroundColor: "#b2bec3" }}>
          <div>sticky</div>
          <div>sticky</div>
          <div>sticky</div>
          <div>sticky</div>
          <div>sticky</div>
        </div>
      </Sticky>
      <div>{Array(15).fill(null).map(Placeholder)}</div>
    </StickyContainer>
  );
};

export default BaseStory;
