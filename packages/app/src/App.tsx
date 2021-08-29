import fp from "utils/boundaries/lodash";
import { Switch, Route } from "react-router-dom";
import routeConfigs from "routes";
import "./index.css";

const { values, map } = fp;
const routes = values(routeConfigs);

function App() {
  return (
    <Switch>
      {map(
        (route) => (
          <Route key={route.regexPath} path={route.path} component={route.component} />
        ),
        routes,
      )}
    </Switch>
  );
}

export default App;
