/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// 처음에 setting할 router값을 받기위한 타입(home.tsx, auth.tsx 에서 mapRouter의 인자로 children을 받기위한 타입)
export type IRouterChildren = { [key: string]: IRouter };

// router config를 위한 기본타입
export type IRouter<P = string, C = IRouterChildren> = {
  regexPath: P;
  title: string;
  component?: (args?: any) => React.ReactElement;
  children?: C;
};

// router adapter에서 추가되는 타입
export type IRouterAddedProperty = {
  path: string;
};

// router adapter가 적용된 후의 children의 타입
type IRouterAdaptedChildren<C> = C extends IRouterChildren ? { [key in keyof C]: IMapRouterReturn<C[key]> } : never;

// mapRouter함수가 리턴하는 타입
export type IMapRouterReturn<C extends IRouter<C["regexPath"]>> = IRouter<
  C["regexPath"],
  IRouterAdaptedChildren<C["children"]>
> &
  IRouterAddedProperty;

export type TStringRemove = "start" | "base" | "end";
