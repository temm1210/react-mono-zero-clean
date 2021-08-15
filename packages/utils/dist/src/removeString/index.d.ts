import { TStringRemove } from "./types";
/**
 * type:start - 찾은 문자열을 시작으로 끝 문자열까지 반환(target: "?", value:"react?kim", result="kim")
 * type:base - 찾은 문자열 하나만 삭제(target: "?", value:"react?kim", result="reactkim")
 * type:end - 첫번째 위치부터 찾은 문자열 위치에 포함되는 문자열 삭제(target: "?", value:"react?kim", result="asf")
 * @param target 삭제할 문자열
 * @returns {string}
 */
declare const remove: (target: string) => (type: TStringRemove) => (value: string) => string;
export default remove;
//# sourceMappingURL=index.d.ts.map