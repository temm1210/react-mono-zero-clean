import { IRouter } from "../types";
export declare const extractPath: (value: string) => string;
/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
declare const routerAdapter: <R extends IRouter<string, import("../types").IRouterChildren>>(routerConfig: R) => R & {
    path: string;
};
export default routerAdapter;
//# sourceMappingURL=index.d.ts.map