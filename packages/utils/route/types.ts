/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// 처음에 setting할 router값을 받기위한 타입(home.tsx, auth.tsx 에서 mapRouter의 인자로 children을 받기위한 타입)
type IRouterChildren = { [key: string]: IRouter };

// router adapter가 적용된 후의 children의 타입
type IRouterAdapterChildren<C> = C extends IRouterChildren
  ? { [key in keyof C]: IMapRouterReturn<C[key]> }
  : C extends IRouter
  ? { [key in keyof C["children"]]: IMapRouterReturn<C["children"][key]> }
  : never;

// router config를 위한 기본타입
export interface IRouter<C = IRouterChildren> {
  regexPath: string;
  title: string;
  component: (args?: any) => React.ReactElement;
  children?: C;
}

// router adapter에서 추가되는 타입
export interface IRouterAddedProperty {
  path: string;
  params: any;
  query: any;
}

// mapRouter함수가 리턴하는 타입
export interface IMapRouterReturn<C> extends IRouter<IRouterAdapterChildren<C>>, IRouterAddedProperty {}

// router adapter하는 타입
export type IRouterAdapterReturn = IRouter & IRouterAddedProperty;

export type TStringRemove = "start" | "base" | "end";
