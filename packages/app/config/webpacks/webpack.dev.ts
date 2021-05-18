import { Configuration } from "webpack";
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

export default webpackDevelopmentConfig;
