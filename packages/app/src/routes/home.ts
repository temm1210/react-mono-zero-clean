import { mapRouter } from "./utils";

export default mapRouter({
  regexPath: "/home/:id(posts|comments)/:test(tt|aa|cc)?a=1&b=2",
  title: "home3",
  children: {
    home1: { regexPath: "/", title: "home1" },
    home2: { regexPath: "/home/:id", title: "home2" },
    home3: {
      regexPath: "/home/:id(posts|comments)/:test(tt|aa|cc)?a=1&b=2",
      title: "home3",
      children: {
        home55: { regexPath: "/home/:id", title: "home2" },
      },
    },
    home4: { regexPath: "/home/:id?/:pass?", title: "home2" },
  },
});
