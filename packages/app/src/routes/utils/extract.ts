import _ from "lodash/fp";
import { remove } from "./removeString";

const { flow, map, split, filter, includes, replace, join, keyBy, identity } = _;

const removeQuestionMark = remove("?");
const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");

const removeBraces = remove("(");
const removeBracesFromFindIndexToEnd = removeBraces("end");

export const extractParams = (value: string) =>
  flow(
    split("/"),
    filter(includes(":")),
    map(replace(":", "")),
    map(removeQuestionMarkFromFindIndexToEnd),
    map(removeBracesFromFindIndexToEnd),
    keyBy(identity),
  )(value);

export const extractQueryString = (value: string) => flow(split("?"), filter(includes("&")))(value);

export const extractPath = (value: string) => flow(split("/"), map(removeBracesFromFindIndexToEnd), join("/"))(value);
