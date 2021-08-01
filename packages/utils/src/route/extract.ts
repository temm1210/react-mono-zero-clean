import fp from "../fp";
import { remove } from "./removeString";

const { chaining, map, split, filter, includes, replace, join, keyBy, identity } = fp;

const removeQuestionMark = remove("?");
const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");

const removeBraces = remove("(");
const removeBracesFromFindIndexToEnd = removeBraces("end");

export const extractParams = (value: string) =>
  chaining(
    split("/"),
    filter(includes(":")),
    map(replace(":", "")),
    map(removeQuestionMarkFromFindIndexToEnd),
    map(removeBracesFromFindIndexToEnd),
    keyBy(identity),
  )(value);

export const extractQueryString = (value: string) =>
  chaining(split("?"), filter(includes("&")))(value);

console.log("Test");
export const extractPath = (value: string) =>
  chaining(split("/"), map(removeBracesFromFindIndexToEnd), join("/"))(value);
