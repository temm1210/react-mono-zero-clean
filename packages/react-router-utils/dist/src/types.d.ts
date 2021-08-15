import React from "react";
export declare type IRouterChildren = {
    [key: string]: IRouter;
};
export declare type IRouter<P = string, C = IRouterChildren> = {
    regexPath: P;
    title: string;
    component: (args?: any) => React.ReactElement;
    children?: C;
};
export declare type IRouterAddedProperty = {
    path: string;
};
declare type IRouterAdaptedChildren<C> = C extends IRouterChildren ? {
    [key in keyof C]: IMapRouterReturn<C[key]>;
} : never;
export declare type IMapRouterReturn<C extends IRouter<C["regexPath"]>> = IRouter<C["regexPath"], IRouterAdaptedChildren<C["children"]>> & IRouterAddedProperty;
/**
 * 구분자(D)를 통해 문자열분리
 * @example
 * // return "" | "home" | ":param1(a|b)" | ":param2(c|d)?"
 * PathSeparate<"/home/:param1(a|b)/:param2(c|d)", "/">
 */
declare type PathSeparate<P extends string, D extends string> = P extends `${infer L}${D}${infer R}` ? [L, ...PathSeparate<R, D>] : [P];
/**
 * @example
 * // return "param(a|b) | param2(c|d)?"
 * ExtractParam<"" | "home" | ":param1(a|b)" | ":param2(c|d)?">
 */
declare type ExtractParam<T extends string> = T extends `:${infer P}` ? P : never;
declare type Param<N = string, V = unknown, R = boolean> = {
    name: N;
    value: V;
    required: R;
};
/**
 * required(?) 의 유무에따라 param을 parsing
 * @example
 * // return {name:param, value: a | b, required:true} | {name:param2?, value: c | d, required:false}
 * ParseParam<"param(a|b) | param2(c|d)?">
 */
declare type ParseParam<K extends string> = K extends `${infer N}(${infer P})` ? Param<N, PathSeparate<P, "|">[number], true> : K extends `${infer N}(${infer P})?` ? Param<N, PathSeparate<P, "|">[number], false> : Param<K, string, true>;
declare type GetParseParams<P extends string> = ParseParam<ExtractParam<PathSeparate<P, "/">[number]>>;
declare type ExtractValueOfParam<O extends Param, K> = Extract<O, {
    name: K;
}>["value"];
/**
 * required(?) 값에따라 param value의 key값을 다르게 parsing
 * @example
 * // return {param1:a | b, param2?: c | d}
 * ParseParam<"/home/:param1(a|b)/:param2(c|d)">
 */
export declare type ParamsFromPath<P extends string, O extends Param = GetParseParams<P>> = {
    [key in Extract<O, {
        required: true;
    }>["name"]]: ExtractValueOfParam<O, key>;
} & {
    [key in Extract<O, {
        required: false;
    }>["name"]]?: ExtractValueOfParam<O, key>;
};
export {};
//# sourceMappingURL=types.d.ts.map