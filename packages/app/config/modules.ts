import path from "path";
import fs from "fs";
import ts, { CompilerOptions } from "typescript";
import paths from "./paths";

// tsconfig.json파일의 타입을 정의
interface ITsConfig {
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
}

// tsconfig.json파일의 유무를 확인하고
// compilerOptions옵션값을 가져오는 함수
function getTsConfigJsonFile() {
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  // jsconfig.json, tsconfig.json두개 파일 공존할시 에러발생
  // https://www.typescriptlang.org/tsconfig
  if (hasTsConfig && hasJsConfig) {
    throw new Error("tsconfig.json, jsconfig.json를 동시에 사용할수 없습니다. tsconfig.json 하나만 사용해주세요. ");
  }

  // typescript 사용 강제화
  if (!hasTsConfig) {
    throw new Error("tsconfig.json이 반드시 있어야합니다.");
  }

  // tsconfig.json 저장
  const tsconfig: ITsConfig = ts.readConfigFile("tsconfig.json", ts.sys.readFile).config;

  return tsconfig;
}

/**
 * tsconfig.json의 옵션중 compilerOptions.baseUrl의 셋팅값을 찾아
 * 해당 경로를 반환하는 함수(webpack의 modules에 추가할때도 사용)
 * @param {compilerOptions } ITsConfig
 * @returns { string | null | error | "" } baseUrl이 있을시 해당 경로를 반환. 없을시에는 ""반환. paths.appSrc의 값이랄 다를경우 error반환
 */
function getModulesPath(tsConfig: ITsConfig) {
  const {
    compilerOptions: { baseUrl },
  } = tsConfig;

  //   baseUrl이 없다면 module지정 하지않음(전부 상대경로로 받아와야함)
  if (!baseUrl) {
    return "";
  }

  // 프로젝트 디렉터리부터 baseUrl까지 전체 경로를 구함
  const baseUrlPath = path.resolve(paths.appPath, baseUrl);

  //  baseUrl이 paths.appSrc에 설정한 경로랑 같을시 해당 모듈의 경로를 반환함
  if (path.relative(paths.appSrc, baseUrlPath) === "") {
    return [paths.appSrc];
  }

  // throw new Error(`반드시 ${paths.appSrc}와 tsconfig.json의 baseUrl을 일치시켜주세요`);
}

export default {
  modulePath: getModulesPath(getTsConfigJsonFile()),
};
