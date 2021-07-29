import { Link, generatePath } from "react-router-dom";
import routes from "routes";

function Home() {
  return (
    <div>
      <div>
        Home 입니다
        <div>
          <Link to={generatePath(routes.auth.regexPath, { entity: "test" })}>이동</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
