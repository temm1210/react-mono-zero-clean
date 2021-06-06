/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import webpack from "webpack";
import chalk from "chalk";
import WebpackDevserver from "webpack-dev-server";
import webpackDevConfig from "../webpacks/webpack.dev";
import devserverConfig from "../devServerConfig";
import clearConsole from "../utils/clearConsole";
import createWebpackCompiler from "../utils/createWebpackCompiler";
import prepareUrls from "../utils/prepareUrls";
import { Environment } from "../env";

process.env.NODE_ENV = Environment.DEVELOPMENT;

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const { HOST, PUBLIC_URL } = process.env;
const PORT = parseInt(process.env.PORT || "3000", 10);

if (!HOST || !PUBLIC_URL) {
  console.log(chalk.red(`Must have ${chalk.bold.red("HOST")},${chalk.bold.red("PUBLIC_URL")} in .env`));
  process.exit(0);
}

const urls = prepareUrls(protocol, HOST, PORT, PUBLIC_URL);

const webpackCompiler: any = createWebpackCompiler(webpackDevConfig, webpack, urls);
const webpackDevserver = new WebpackDevserver(webpackCompiler, devserverConfig());

// 서버실행
webpackDevserver.listen(PORT, HOST, (err) => {
  clearConsole();
  if (err) return console.log(chalk.red(err));
  console.log(chalk.bold("---Starting react development server---"));
});
