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
            // auto prefix 사용하기 위해 postcss-loader 추가
            use: ["style-loader", "css-loader", "postcss-loader"],
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
    if (key === "module") return devOptions;
    return commonOptions;
  },
})(commonWebpack(), webpackDevelopmentConfig);

export default config;
