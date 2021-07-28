import _ from "lodash/fp";
import { Routes, Route } from "react-router-dom";
import routeConfigs from "routes";
import "./index.css";

const { values, map } = _;
const routes = values(routeConfigs);

function App() {
  console.log("111");
  return (
    <Routes>
      {map(
        (route) => (
          <Route key={route.regexPath} path={route.path} element={route.component()} />
        ),
        routes,
      )}
    </Routes>
  );
}

export default App;
