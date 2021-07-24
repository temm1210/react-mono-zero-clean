export type IRouterChildren = { [key: string]: IRouter };

export interface IRouter {
  regexPath: string;
  title: string;
  children?: IRouterChildren;
}

export type TStringRemove = "start" | "base" | "end";
