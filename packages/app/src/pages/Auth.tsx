import { ParamsFromPath } from "@project/react-router-utils";
import routes from "routes";
import { useParams } from "react-router-dom";

function Test() {
  const { entity } = useParams<ParamsFromPath<typeof routes.auth.regexPath>>();
  console.log("routes.auth:", routes.auth);
  console.log("entity:", entity);
  return <div>Auth</div>;
}

export default Test;
