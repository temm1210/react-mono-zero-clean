/* eslint-disable no-param-reassign */

/**
 * 개발환경에 대한 정의 (develop, test, production ,local)
 */
export const Environment = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

/**
 * .env설정파일에 NODE_ENV, PUBLIC_URL 두 개의 환경변수를 추가해서 {key:value} 형태의 object를 만듬
 * webpack.EnvironmentPlugin에 사용하기 위한 설정
 * @param {string} publicPath - webpack.output.publicPath에 해당하는 값
 */
function getEnvironment(publicPath: string) {
  // env파일에 반드시 있어야 할 기본 환경변수들 설정
  const baseEnv = {
    NODE_ENV: process.env.NODE_ENV || Environment.DEVELOPMENT,
    // PUBLIC_URL을 사용하는 이유는 프론트서버에서 publicPath를 기준점으로 설정하여 asset을 가져오기위함
    // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
    PUBLIC_URL: publicPath,
    PORT: process.env.PORT || "3000",
  } as NodeJS.ProcessEnv;

  // env파일에 저장된값을 key:value형태로 변환
  const envObject = Object.keys(process.env).reduce((env, key: keyof NodeJS.ProcessEnv) => {
    env[key] = process.env[key];
    return env;
  }, baseEnv);

  return envObject;
}

export default getEnvironment;
