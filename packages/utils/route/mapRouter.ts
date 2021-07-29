import fp from "../fp";
import { extractQueryString, extractParams, extractPath } from "./extract";
import { IRouter, IMapRouterReturn, IRouterAdapterReturn } from "./types";

const { mapValues } = fp;

/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
const routerAdapter = <R extends IRouter>(routerConfig: R): IRouterAdapterReturn => ({
  ...routerConfig,
  path: extractPath(routerConfig.regexPath),
  params: extractParams(routerConfig.regexPath),
  query: extractQueryString(routerConfig.regexPath),
});

// Function Overloading
function mapRouter<R extends IRouter>(routerConfig: R): IMapRouterReturn<R["children"]>;
function mapRouter(routerConfig: IRouter) {
  const adaptedRoute = routerAdapter(routerConfig);

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
