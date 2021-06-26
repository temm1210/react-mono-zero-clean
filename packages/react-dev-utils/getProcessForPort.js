/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-template */
import chalk from "chalk";
// execSync는 명령어의 집합(command. ex execOptions) 의 동기버전
import { execSync, execFileSync } from "child_process";

const execOptions = {
  encoding: "utf8",
  stdio: [
    "pipe", // stdin (default)
    "pipe", // stdout (default)
    "ignore", // stderr
  ],
};

function getProcessIdOnPort(port) {
  return execFileSync("lsof", ["-i:" + port, "-P", "-t", "-sTCP:LISTEN"], execOptions)
    .split("\n")[0]
    .trim();
}

function getDirectoryOfProcessById(processId) {
  return execSync("lsof -p " + processId + ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'', execOptions).trim();
}

function getProcessCommand(processId, appName) {
  const command = execSync("ps -o command -p " + processId + " | sed -n 2p", execOptions).replace(/\n$/, "");

  return appName || command;
}

/**
 * 주어진 PORT로 기존에 실행되는 앱이 있는지 확인하는 함수
 */
function getProcessForPort(port, appName) {
  try {
    const processId = getProcessIdOnPort(port);
    const directory = getDirectoryOfProcessById(processId);
    const command = getProcessCommand(processId, appName);
    return chalk.cyan(command) + chalk.grey(" (pid " + processId + ")\n") + chalk.blue("  in ") + chalk.cyan(directory);
  } catch (e) {
    return null;
  }
}

export default getProcessForPort;
