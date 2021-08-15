import { fp } from "@project/utils";
import adapter from "./adapter";
import { IRouter, IMapRouterReturn } from "./types";
// import { ParamsFromPath } from "../extract/types";

const { mapValues } = fp;

// Function Overloading
function mapRouter<R extends IRouter>(routerConfig: R): IMapRouterReturn<R>;
function mapRouter<R extends IRouter>(routerConfig: R) {
  const adaptedRoute = adapter(routerConfig);
  if (!routerConfig?.children) return adaptedRoute;

  // 재귀호출
  const mappingChildren = mapValues((router) => mapRouter(router), adaptedRoute.children);

  const result = {
    ...adaptedRoute,
    children: mappingChildren,
  };

  return result;
}

export default mapRouter;
