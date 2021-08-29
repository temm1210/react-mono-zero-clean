/* eslint-disable react/display-name */
import { mapRouter } from "@project/react-router-utils";
import { Auth } from "pages";

export default mapRouter({
  regexPath: "/auth/:entity(a|b|c)",
  title: "Auth",
  component: function AuthPage(args) {
    return <Auth {...args} />;
  },
  children: {
    auth2: {
      regexPath: "/auth/:id",
      title: "Auth",
      component: function AuthPage2(args) {
        return <Auth {...args} />;
      },
    },
  },
  // children: {
  //   auth2: { regexPath: "/auth/:id", title: "auth2" },
  //   auth3: { regexPath: "/auth/:id/:type?", title: "auth3" },
  //   auth4: { regexPath: "/auth/:id(a|b)/:type?", title: "auth3" },
  // },
} as const);
