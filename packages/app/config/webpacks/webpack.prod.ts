import webpack, { Configuration } from "webpack";
// style을 css파일로 병합및 추출해줌
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// css압축및 캐시기능 활성화
// 현재 @types/css-minimizer-webpack-plugin 1.1.1버전만 호환
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
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
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
        ],
      },
    ],
  },
  // 최적화옵션
  optimization: {
    minimize: true,
    minimizer: [
      // css압축
      new CssMinimizerPlugin({
        // 여러프로세스를 parallel 하게 실행해서 빌드속도를 높여줌(기본값 cpu 프로세스 -1)
        parallel: true,
      }),
    ],
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

export default webpackProductionConfig;
