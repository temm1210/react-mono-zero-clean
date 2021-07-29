import {
  flow,
  map,
  split,
  filter,
  includes,
  replace,
  join,
  keyBy,
  identity,
  mapValues,
} from "lodash/fp";

const mixin = {
  chain: flow,
  map,
  split,
  filter,
  includes,
  replace,
  join,
  keyBy,
  identity,
  mapValues,
};

export default mixin;
