import { map, mapValues, split, join, flow } from "lodash/fp";

// import _ from "lodash/fp";
// const {map, mapValues, split, join, flow} = _
// 위와같이 사용했을시 번들링후 사용하는 프로젝트에서 참조를 못하는 경우가 발생

const lodashBoundary = {
  chaining: flow,
  mapValues,
  map,
  split,
  join,
};
export default lodashBoundary;
