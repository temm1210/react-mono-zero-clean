import fp from "../../fp";
import { extractPath } from "../extract";
import { IRouter, IMapRouterReturn } from "./types";
// import { ParamsFromPath } from "../extract/types";

const { mapValues } = fp;

/**
 * 원하는 route 형태로 변경해주는 함수
 * @return {Object}
 */
const routerAdapter = <R extends IRouter>(routerConfig: R) => ({
  ...routerConfig,
  path: extractPath(routerConfig.regexPath),
});

// Function Overloading
function mapRouter<R extends IRouter>(routerConfig: R): IMapRouterReturn<R>;
function mapRouter<R extends IRouter>(routerConfig: R) {
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

const test = mapRouter({
  regexPath: "/auth/:entity",
  title: "Auth",
  children: {
    auth2: {
      regexPath: "/auth23/:test?(test|test2)",
      title: "Auth",
    },
  },
  // children: {
  //   auth2: { regexPath: "/auth/:id", title: "auth2" },
  //   auth3: { regexPath: "/auth/:id/:type?", title: "auth3" },
  //   auth4: { regexPath: "/auth/:id(a|b)/:type?", title: "auth3" },
  // },
} as const);

// test.children?.auth2.
// test.title ="test"
// const af = mapRouter(test);
// console.log(af);
// const te = af.children?.auth2.regexPath || ""
// const d:ParamsFromPath<typeof te> = ""

// d.

export default mapRouter;
