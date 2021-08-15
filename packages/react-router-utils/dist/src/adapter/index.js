"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPath = void 0;
var utils_1 = require("@project/utils");
var chaining = utils_1.fp.chaining, map = utils_1.fp.map, split = utils_1.fp.split, join = utils_1.fp.join;
// const removeQuestionMark = removeString("?");
// const removeQuestionMarkFromFindIndexToEnd = removeQuestionMark("end");
// "("를 제거하는 함수 생성
var removeBraces = utils_1.removeString("(");
// "("가 발견된 지점부터 문자열 끝까지 삭제하는 함수 생성
var removeBracesFromFindIndexToEnd = removeBraces("end");
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
var extractPath = function (value) {
    return chaining(split("/"), map(removeBracesFromFindIndexToEnd), join("/"))(value);
};
exports.extractPath = extractPath;
/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
var routerAdapter = function (routerConfig) { return (__assign(__assign({}, routerConfig), { path: exports.extractPath(routerConfig.regexPath) })); };
exports.default = routerAdapter;
//# sourceMappingURL=index.js.map