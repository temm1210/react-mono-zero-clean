/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-template */
import chalk from "chalk";
import detect from "detect-port-alt";
// import isRoot from "is-root";
import prompts from "prompts";
import clearConsole from "./clearConsole";
import getProcessForPort from "./getProcessForPort";

const isInteractive = process.stdout.isTTY;

// 주어진 host와 defaultPort에 실행되는 앱이 있는지 확인후
// 없으면 앱을 실행하고 있으면 prompts로 메세지를 띄워서 사용자와 interactive를 함
function choosePort(host: string, defaultPort: number) {
  return detect(defaultPort, host).then(
    (port: number) =>
      new Promise((resolve) => {
        if (port === defaultPort) {
          return resolve(port);
        }
        // 출력할 error메세지 작성
        const message =
          process.platform !== "win32" && defaultPort < 1024 ? `Admin permissions are required to run a server on a port below 1024.` : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          //  해당 port로 실행되고 있는 앱이 있는지 확인후 메세지 return
          const existingProcess = getProcessForPort(defaultPort);

          const question = {
            type: "confirm",
            name: "shouldChangePort",
            message: chalk.yellow(message + `${existingProcess ? ` Probably:\n  ${existingProcess}` : ""}`) + "\n\nWould you like to run the app on another port instead?",
            initial: true,
          } as const;

          // 사용자와 terminal상에서 interactive
          prompts(question).then((answer) => {
            // 사용자가 y를 눌럿을때
            if (answer.shouldChangePort) {
              resolve(port);
              // 사용자가 n를 눌럿을때
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
      }),
    (err: any) => {
      throw new Error(chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) + "\n" + ("Network error message: " + err.message || err) + "\n");
    },
  );
}

export default choosePort;
