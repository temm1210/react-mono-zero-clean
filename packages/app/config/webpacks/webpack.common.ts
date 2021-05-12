/* eslint-disable import/no-extraneous-dependencies */

import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import dotenv from "dotenv";

dotenv.config();

/**
 * webpack의 types와 devServer가 현재 align이 되지않는 문제 때문에 타입을 따로 생성
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27570}
 */
export interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
