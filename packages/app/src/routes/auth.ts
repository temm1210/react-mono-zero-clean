import mapRouter from "./utils/mapRouter";

export default mapRouter({
  regexPath: "/auth",
  title: "auth1",
  children: {
    auth2: { regexPath: "/auth/:id", title: "auth2" },
    auth3: { regexPath: "/auth/:id/:type?", title: "auth3" },
    auth4: { regexPath: "/auth/:id(a|b)/:type?", title: "auth3" },
  },
});
