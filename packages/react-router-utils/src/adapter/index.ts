import { removeString } from "@project/utils";
import { IRouter } from "../types";
import fp from "../boundaries/lodash";

const { chaining, map, split, join } = fp;

// const removeQuestionMark = removeString("?");
// const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");

// "("를 제거하는 함수 생성
const removeBraces = removeString("(");
// "("가 발견된 지점부터 문자열 끝까지 삭제하는 함수 생성
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

/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
const routerAdapter = <R extends IRouter>(routerConfig: R) => ({
  ...routerConfig,
  path: extractPath(routerConfig.regexPath),
});

export default routerAdapter;
