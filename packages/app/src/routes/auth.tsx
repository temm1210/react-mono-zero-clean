import { mapRouter } from "@project/utils";
import { Auth } from "pages";

export default mapRouter({
  component: function AuthPage(args) {
    return <Auth {...args} />;
  },

  regexPath: "/auth/:entity",
  title: "Auth",
  children: {
    auth2: {
      regexPath: "/auth23",
      title: "Auth",
      component: function AuthPage(args) {
        return <Auth {...args} />;
      },
    },
  },
  // children: {
  //   auth2: { regexPath: "/auth/:id", title: "auth2" },
  //   auth3: { regexPath: "/auth/:id/:type?", title: "auth3" },
  //   auth4: { regexPath: "/auth/:id(a|b)/:type?", title: "auth3" },
  // },
});
