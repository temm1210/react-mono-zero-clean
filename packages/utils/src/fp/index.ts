import _ from "lodash/fp";

const { flow, ...rest } = _;

const mixin = {
  chaining: flow,
  ...rest,
};

export default mixin;
