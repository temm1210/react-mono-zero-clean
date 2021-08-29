import { generatePath, Link } from "react-router-dom";
import routes from "routes";

function Home() {
  const test = generatePath("/user/:id/:entity(posts|comments)", {
    id: "test",
    entity: "posts",
  });

  console.log("test:", test);
  return (
    <div>
      <div>
        Home 입니다
        <div>
          <Link to={generatePath(routes.auth.regexPath, { entity: "a" })}>이동</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
