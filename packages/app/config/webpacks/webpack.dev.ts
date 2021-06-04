import webpack, { Configuration as WebpackConfiguration } from "webpack";
import { mergeWithCustomize } from "webpack-merge";
import commonWebpack from "./webpack.common";
import { Environment } from "../env";

const webpackDevelopmentConfig: WebpackConfiguration = {
  mode: Environment.DEVELOPMENT,
  devtool: "inline-source-map",
  bail: false,
  module: {
    rules: [
      // style파일 처리
      // style을 head태그에 넣음
      {
        oneOf: [
          {
            test: /\.css$/i,
            // autoprefix 사용하기 위해 postcss-loader 추가
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
        ],
      },
    ],
  },
  // HMR설정
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // 아래 문구를 넣지않으면 webpack5 버전에서 HMR이 작동하지않음.
  // https://github.com/webpack/webpack-dev-server/issues/2758
  target: "web",
};

// webpack.common.ts파일과 webpackDevelopmentConfig 머지
const config = mergeWithCustomize({
  /**
   * 기본 webpack 옵션과 target webpack옵션을 merge할때 같은 키 값에대한 merge 전략을 구성
   * 기본정책은 append이며 가끔 인식이 안되는 키값이 있는데(module.rules[0].oneOf), 이럴경우 key값을 추출해서 어떠한 전략을 사용할지 작성해야함
   * (덮어씌울지, 기존옵션값 뒤에 추가할지 등)
   * @see {@link https://github.com/survivejs/webpack-merge#mergewithcustomize-customizearray-customizeobject-configuration--configuration} - merge 전략옵션
   * @param commonOptions - 기본 commonWebpack의 설정값
   * @param devOptions - mergeWithCustomize의 2번째 인자값의 속성값
   * @param key - webpack의 property값(entry, module, module.rules,output 등등)
   */
  customizeArray(commonOptions, devOptions, key) {
    switch (key) {
      // module.rules에 대해선 oneOf키값에 prepend전략을 사용
      // baseWebpack의 설정값 앞에 target webpack 설정값을 더함
      case "module.rules":
        return [{ oneOf: [...devOptions[0].oneOf, ...commonOptions[0].oneOf] }];
      default:
        return undefined;
    }
  },
})(commonWebpack(), webpackDevelopmentConfig);

export default config;
