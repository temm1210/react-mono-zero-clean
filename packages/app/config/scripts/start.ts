/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import webpack from "webpack";
import chalk from "chalk";
import WebpackDevserver from "webpack-dev-server";
import { clearConsole, createWebpackCompiler, checkBrowser, prepareUrls, choosePort } from "@project/react-dev-utils";

import webpackDevConfig from "../webpacks/webpack.dev";
import devserverConfig from "../devServerConfig";
import { Environment } from "../env";
import paths from "../paths";

process.env.NODE_ENV = Environment.DEVELOPMENT;

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const PUBLIC_URL = process.env.PUBLIC_URL || ".";
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const APP_NAME = require(paths.packageJson).name;

checkBrowser(paths.appPath)
  .then(() => {
    // 시작하기전에 PORT로 실행되는 앱이 있는지 확인
    return choosePort(HOST, PORT, APP_NAME);
  })
  // 이미 주어진 PORT로 실행중이라면
  // 다음 .then에서는 다른 port값으로 앱을 실행시킴
  .then((port: number) => {
    // port가 없거나
    // prompt창에서 이미 존재하는 포트가 있으므로 다른 포트로 실행하시겠습니까? 에서 no를 클릭했을때
    // 앱을 종료시킴
    if (port === null) {
      return;
    }
    const urls = prepareUrls(protocol, HOST, port, PUBLIC_URL);

    const devSocket = {
      warnings: (warnings: any) => webpackDevserver.sockWrite(webpackDevserver.sockets, "warnings", warnings),
      errors: (errors: any) => webpackDevserver.sockWrite(webpackDevserver.sockets, "errors", errors),
    };
    const webpackCompiler: any = createWebpackCompiler(webpackDevConfig, devSocket, webpack, urls, APP_NAME);
    const webpackDevserver = new WebpackDevserver(webpackCompiler, devserverConfig());

    // 서버실행
    webpackDevserver.listen(port, HOST, (err) => {
      clearConsole();
      if (err) return console.log(chalk.red(err));
      console.log(chalk.bold("---Starting react development server---"));
    });
  });
