/* eslint-disable import/no-extraneous-dependencies */

import webpack, { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";
import paths from "../paths";
import getModulePaths from "../modules";
import getEnvironment, { Environment } from "../env";

dotenv.config();

/**
 * webpack의 types와 devServer가 현재 align이 되지않는 문제 때문에 타입을 따로 생성
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27570}
 */
export interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config = (): IConfiguration => {
  const env = getEnvironment("/");

  return {
    entry: paths.entryPath,
    module: {
      rules: [
        {
          // 아래 rule중 하나만 만족하도록 설정
          oneOf: [
            {
              test: /\.(js|ts|tsx)$/,
              exclude: /node_modules/,
              loader: "babel-loader",
            },
            // asset관련 파일 처리(10kb 미만의 작은 에셋들만 처리)
            // 파일대신 string으로 값을 뽑아 대체함
            {
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              loader: "url-loader",
              options: {
                limit: 10000, // 10kb
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            // 위의 어떤조건도 해당하지 않는다면 다음 구문이 실행됨
            // 10kb이상의 에셋들을 처리
            {
              loader: "file-loader",
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: "[name].[contenthash].js",
      path: paths.buildPath,
      publicPath: "/",
      clean: true,
      // chunkFilename: "static/js/[name].[contenthash].chunk.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      // 절대경로 사용을 위한 설정
      // 앱 디렉터리부터 node_modules를 포함해, tsconfig.json의 baseUrl까지의 전체 경로를 설정
      modules: ["node_modules", paths.appNodeModules].concat(getModulePaths.modulePath || []),
    },
    plugins: [
      // 번들링 한 css, js파일을 각각 html파일에
      // link태그와 script태그로 추가 해주는 플러그인
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.publicHtmlPath,
        minify:
          process.env.NODE_ENV === Environment.PRODUCTION
            ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              }
            : undefined,
      }),
      new ForkTsCheckerWebpackPlugin({
        // true면 webpack 컴파일이 끝난후 리포트 보고가 이루어짐
        // 될수있으면 watch모드(development)에서 실행하는걸 권장
        async: false,
        eslint: {
          // tsx,ts파일만 type checking진행(.css 무시)
          files: "./src/**/*.{tsx,ts}",
        },
      }),
      // env값들을 react에서 사용하기위한 설정
      // new webpack.DefinePlugin(env.stringified),
      new webpack.EnvironmentPlugin(env),
    ],
  };
};

export default config;
