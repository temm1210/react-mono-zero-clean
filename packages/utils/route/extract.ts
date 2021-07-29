import fp from "../fp";
import { remove } from "./removeString";

const { chain, map, split, filter, includes, replace, join, keyBy, identity } = fp;

const removeQuestionMark = remove("?");
const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");

const removeBraces = remove("(");
const removeBracesFromFindIndexToEnd = removeBraces("end");

export const extractParams = (value: string) =>
  chain(
    split("/"),
    filter(includes(":")),
    map(replace(":", "")),
    map(removeQuestionMarkFromFindIndexToEnd),
    map(removeBracesFromFindIndexToEnd),
    keyBy(identity),
  )(value);

export const extractQueryString = (value: string) =>
  chain(split("?"), filter(includes("&")))(value);

export const extractPath = (value: string) =>
  chain(split("/"), map(removeBracesFromFindIndexToEnd), join("/"))(value);
