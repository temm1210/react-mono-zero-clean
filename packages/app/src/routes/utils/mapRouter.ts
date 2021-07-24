import _ from "lodash/fp";
import { extractQueryString, extractParams, extractPath } from "./extract";
import { IRouter } from "./types";

/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
const routeAdapter = <R extends IRouter>(routerConfig: R) => ({
  ...routerConfig,
  pathname: extractPath(routerConfig.regexPath),
  params: extractParams(routerConfig.regexPath),
  query: extractQueryString(routerConfig.regexPath),
});

export function mapRouter<R extends IRouter>(routerConfig: R) {
  return routeAdapter(routerConfig);
}
