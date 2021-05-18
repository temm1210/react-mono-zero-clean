import { Configuration } from "webpack";
import { mergeWithCustomize } from "webpack-merge";
import commonWebpack from "./webpack.common";
import { Environment } from "../env";

const DEV_MODE = Environment.DEVELOPMENT;

process.env.NODE_ENV = DEV_MODE;

const webpackDevelopmentConfig: Configuration = {
  mode: DEV_MODE,
  devtool: "cheap-module-source-map",
  bail: false,
  module: {
    rules: [
      // style파일 처리
      // style을 head태그에 넣음
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    ],
  },
  plugins: [],
};

// webpack.common.ts파일과 webpackDevelopmentConfig 머지
const config = mergeWithCustomize({
  customizeArray(commonOptions, devOptions, key) {
    switch (key) {
      case "module.rules":
        return [{ oneOf: [...devOptions[0].oneOf, ...commonOptions[0].oneOf] }];
      default:
        return undefined;
    }
  },
})(commonWebpack(), webpackDevelopmentConfig);

export default config;
