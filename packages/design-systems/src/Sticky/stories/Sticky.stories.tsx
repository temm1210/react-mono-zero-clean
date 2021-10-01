import { Meta } from "@storybook/react";
import { Sticky, StickyContainer } from "../index";
import BaseStory from "./BaseStory";

export default {
  component: StickyContainer,
  subcomponents: { Sticky },
  title: "Design Systems/Sticky",
} as Meta;

export const Base = BaseStory;

// const Template: Story<StickyContainerProps> = (args) => <StickyContainer {...args} />;

// const Placeholder = () => <div style={{ margin: "50px 0" }}>placeholder</div>;

// export const Base = Template.bind({});
// Base.args = {
//   children: (
//     <div>
//       <div>{Array(5).fill(null).map(Placeholder)}</div>
//       <Sticky>
//         <div style={{ backgroundColor: "#b2bec3" }}>
//           <div>sticky</div>
//           <div>sticky</div>
//           <div>sticky</div>
//           <div>sticky</div>
//           <div>sticky</div>
//         </div>
//       </Sticky>

//       <div>{Array(15).fill(null).map(Placeholder)}</div>
//     </div>
//   ),
// };
