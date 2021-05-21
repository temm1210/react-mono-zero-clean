/* eslint-disable @typescript-eslint/no-explicit-any */
import webpack, { Configuration } from "webpack";
import { Environment } from "../env";

const PROD_MODE = Environment.PRODUCTION;

process.env.NODE_ENV = PROD_MODE;

const webpackProductionConfig: Configuration = {
  mode: PROD_MODE,
  devtool: "cheap-module-source-map",
  // 에러발생시 바로 번들리 종료시킴
  // dev에서는 HMR을 사용하여 번들링 취소보단 console에 로그를 기록.(false)
  bail: true,
  module: {
    rules: [
      {
        oneOf: [
          // style파일 처리
          // style을 css파일로 추출
          {
            test: /\.css$/i,
            use: ["css-loader"],
          },
        ],
      },
    ],
  },
  // 최적화옵션
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      // name생성 안함(production에서 항상 일정한 이름사용)
      name: false,
    },
    // 런타임 청크는 분리해서 캐시화
    // 이걸사용하지 않으면 런타임이 각각 벤더에 모두 들어가서 캐시화X및 파일사이즈가 커짐
    runtimeChunk: {
      name: (entrypoint: any) => `runtime~${entrypoint.name}`,
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

export default webpackProductionConfig;
