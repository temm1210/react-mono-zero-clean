import { Configuration } from "webpack-dev-server";
import paths from "./paths";

/**
 * webpackDevserver 설정파일
 * 후에 외부에서 옵션으로 받을 값이 있으면 함수 인자로 넘겨주면됨
 */
const devserverConfig = (): Configuration => {
  return {
    // 정적파일 제공 경로
    contentBase: paths.publicPath,
    // contentBase에 적힌 경로에있는 파일이 바뀌면 다시실행
    watchContentBase: true,
    // 압축
    compress: true,
    // webpack devserver가 오픈될때 브라우저오픈
    open: true,
    // 소스코드 바뀌면 다시 실행
    hot: true,
    // devserver log off
    quiet: true,
    clientLogLevel: "none",
    // error-overlay를 사용할꺼기 때문에 ws로변경
    transportMode: "ws",
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    overlay: false,
    // disableHostCheck: true,
  };
};

export default devserverConfig;
