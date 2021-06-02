/* eslint-disable @typescript-eslint/no-explicit-any */
import { Configuration } from "webpack";
import { mergeWithCustomize } from "webpack-merge";
// style을 css파일로 병합및 추출해줌
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// css압축및 캐시기능 활성화
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import commonWebpack from "./webpack.common";
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
            // autoprefix 사용하기 위해 postcss-loader 추가
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          },
        ],
      },
    ],
  },
  // 최적화옵션
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 빌드속도 향상
        parallel: true,
        terserOptions: {
          parse: {
            // ecma8을 파싱
            ecma: 2017,
          },
          compress: {
            // 위의 parse에서 설정된 ecma2017을 따르지않음.
            // 압축할땐 ecma5방식으로 사용(+6의 축약문법 사용X {a:a} => {a}로 사용 X)
            // ecma 설정 5는 최신 코드를 ES5로 변환하지X
            ecma: 5,
            // 비교연산자 reverse사용안함
            comparisons: false,
            // console.*제거
            drop_console: true,
            // 도달하지않는 코드 제거
            dead_code: true,
            // es6모듈 압축
            module: true,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          // 난독화 사파리에서도 활성화
          safari10: true,
          // 프로파일링 모드에서 활성화
          // 클래스네임 난독화
          // keep_classnames: true,
          // 함수네임 난독화
          // keep_fnames: true,
          output: {
            // 위의 parse에서 설정된 ecma2017을 따르지않음.
            // 압축할땐 ecma5방식으로 사용(+6의 축약문법 사용X {a:a} => {a}로 사용 X)
            // ecma 설정 5는 최신 코드를 ES5로 변환하지X
            ecma: 5,
            // jsdoc및 모든주석 제거
            comments: true,
            // 표현식(regex)과 이모티콘이 default(false)에서 작동하지않음
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
      }),
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
  // 아래 문구를 넣지않으면 webpack5 버전에서 HMR이 작동하지않음.
  // https://github.com/webpack/webpack-dev-server/issues/2758
  target: "browserslist",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
  ],
};

// webpack.common.ts파일과 webpackProductionConfig 머지
const config = mergeWithCustomize({
  customizeArray(commonOptions, devOptions, key) {
    switch (key) {
      case "module.rules":
        return [{ oneOf: [...devOptions[0].oneOf, ...commonOptions[0].oneOf] }];
      default:
        return undefined;
    }
  },
})(commonWebpack(), webpackProductionConfig);

export default config;
