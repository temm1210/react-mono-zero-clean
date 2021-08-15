import fp from "../../fp";
import { remove } from "../removeString";

const { chaining, map, split, join } = fp;

// const removeQuestionMark = remove("?");
// const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");

const removeBraces = remove("(");
const removeBracesFromFindIndexToEnd = removeBraces("end");

// export const extractParams = <P extends string>(path: P): ParamsFromPath<P> => {
//   return chaining(
//     split("/"),
//     filter(includes(":")),
//     map(replace(":", "")),
//     map(removeQuestionMarkFromFindIndexToEnd),
//     map(removeBracesFromFindIndexToEnd),
//     keyBy(identity),
//   )(path);
// };

// export const extractQueryString = (value: string) =>
//   chaining(split("?"), filter(includes("&")))(value);

export const extractPath = (value: string) =>
  chaining(split("/"), map(removeBracesFromFindIndexToEnd), join("/"))(value);
