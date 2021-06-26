/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import forkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import clearConsole from "./clearConsole";
import paths from "../paths";
import typescriptFormatter from "./typescriptFormatter";
import formatWebpackMessages from "./formatWebpackMessages";

// 최종컴파일 성공 후 app의 정보를 표시
function printInstructions(appName: string, urls: Record<string, any>) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(`  ${chalk.bold("Local:")}            ${urls.localUrlForTerminal}`);
    console.log(`  ${chalk.bold("On Your Network:")}  ${urls.lanUrlForTerminal}`);
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log("Note that the development is not optimized.");
  console.log();
}

/**
 * webpackCompiler을 생성하여 각각의 life cycle때마다 할 일을 지정
 * @param config webpack설정파일
 * @param webpack webpack모듈
 */
function createWebpackCompiler(config: Record<string, any>, devSocket: any, webpack: typeof exports, urls: Record<string, any>) {
  let webpackCompiler;
  try {
    webpackCompiler = webpack(config);
  } catch (error) {
    console.log(chalk.red("Compile is failed"));
    console.log(error.message);
    process.exit(1);
  }

  // 소스코드 수정후 다시 저장했을때 실행되는 webpack hook
  webpackCompiler.hooks.invalid.tap("invalid", () => {
    clearConsole();
    console.log(chalk.green("Compiling....."));
  });

  let tsMessagesPromise: any;
  let tsMessagesResolver: any;

  // 컴파일전
  webpackCompiler.hooks.beforeCompile.tap("beforeCompiler", () => {
    tsMessagesPromise = new Promise((resolve) => {
      tsMessagesResolver = (msgs: Record<string, any>) => resolve(msgs);
    });
  });

  // 타입체크후
  forkTsCheckerWebpackPlugin.getCompilerHooks(webpackCompiler).issues.tap("afterTypeScriptCheck", (diagnostics: any, lints: any) => {
    const allMsgs = [...diagnostics, ...lints];
    const format = (message: any) => `${message.file}\n${typescriptFormatter(message)}`;

    tsMessagesResolver({
      errors: allMsgs.filter((msg) => msg.severity === "error").map(format),
      warnings: allMsgs.filter((msg) => msg.severity === "warning").map(format),
    });
  });

  // 컴파일이 끝난후 실행되는 Hook
  webpackCompiler.hooks.done.tap("done", async (stats: any) => {
    clearConsole();

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    if (statsData.errors.length === 0) {
      const delayedMsg = setTimeout(() => {
        console.log(chalk.yellow("waiting for type check results..."));
      }, 100);

      // 검사결과 나올때까지 waiting
      const messages = await tsMessagesPromise;
      clearTimeout(delayedMsg);

      if (messages.errors.length > 0) {
        devSocket.errors(messages.errors);
      } else if (messages.warnings.length > 0) {
        devSocket.warnings(messages.warnings);
      }
    }

    // type check결과를 formatting
    const allMessages = formatWebpackMessages(statsData);
    const isSuccessful = !allMessages.errors.length && !allMessages.warnings.length;

    if (isSuccessful) {
      const appName = require(paths.packageJson).name;
      console.log(chalk.green("Compiled successfully!"));
      printInstructions(appName, urls);
    }

    // eslint 에러창 콘솔
    if (allMessages.errors.length) {
      if (allMessages.errors.length > 1) {
        allMessages.errors.length = 1;
      }

      console.log(chalk.red("Failed to compile.\n"));
      console.log(allMessages.errors.join("\n\n"));
      // devSocket.errors(allMessages.errors.join("\n\n"));
      return;
    }

    // eslint 경고창 콘솔
    if (allMessages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(allMessages.warnings.join("\n\n"));
      // devSocket.errors(allMessages.warnings.join("\n\n"));
    }
  });

  return webpackCompiler;
}

export default createWebpackCompiler;
