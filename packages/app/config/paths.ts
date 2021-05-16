import path from "path";

// 해당 프로젝트의 전체 디렉터리경로를 반환
// ex /user/home/{project-name}
// 어디서 실행되든 항상 같은 값 반환
const appDirectory = process.cwd();

// 주어진경로(appPath)의 전체 경로를 반환하는 함수
const resolveAppPath = (appPath: string) => path.resolve(appDirectory, appPath);

// appDirectory(app)경로부터 resolveAppPath의 값으로 넘긴 경로까지의 전체 경로를 구함
export default {
  appPath: resolveAppPath("."),
  buildPath: resolveAppPath("build"),
  appTsConfig: resolveAppPath("tsconfig.json"),
  appJsConfig: resolveAppPath("jsconfig.json"),
  appNodeModules: resolveAppPath("node_modules"),
  appSrc: resolveAppPath("src"),
  entryPath: resolveAppPath("src/index.tsx"),
  publicPath: resolveAppPath("public"),
  packageJson: resolveAppPath("package.json"),
  publicHtmlPath: resolveAppPath("public/index.html"),
};
