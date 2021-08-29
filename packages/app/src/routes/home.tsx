import { mapRouter } from "@project/react-router-utils";
import { Home } from "pages";

export default mapRouter({
  regexPath: "/",
  title: "home",
  component: function HomePage(args) {
    return <Home {...args} />;
  },
  // children: {
  //   home1: { regexPath: "/", title: "home1" },
  //   home2: { regexPath: "/home/:id", title: "home2" },
  //   home3: {
  //     regexPath: "/home/:id(posts|comments)/:test(tt|aa|cc)?a=1&b=2",
  //     title: "home3",
  //     children: {
  //       home55: {
  //         regexPath: "/home/:id(posts|comments)/:test(tt|aa|cc)/:pa",
  //         title: "home55",
  //       },
  //     },
  //   },
  //   home4: { regexPath: "/home/:id?/:pass?", title: "home4" },
  // },
});
