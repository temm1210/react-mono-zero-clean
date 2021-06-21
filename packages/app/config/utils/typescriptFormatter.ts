import os from "os";
// 어느소스코드에서 에러가났는지 알려줌
import { codeFrameColumns } from "@babel/code-frame";
import chalk from "chalk";
import fs from "fs";

const issueOrigins = {
  typescript: "TypeScript",
  internal: "fork-ts-checker-webpack-plugin",
};

function formatter(issue: any) {
  const { severity, file, line, message, code, character } = issue;

  const messageColor = severity === "warning" ? chalk.yellow : chalk.red;
  const fileAndNumberColor = chalk.bold.cyan;

  const source = file && fs.existsSync(file) && fs.readFileSync(file, "utf-8");
  const frame = source
    ? codeFrameColumns(source, { start: { line, column: character } })
        .split("\n")
        .map((str) => `  ${str}`)
        .join(os.EOL)
    : "";
  // issueOrigins[origin]
  return [
    messageColor.bold(`${issueOrigins} ${severity.toLowerCase()} in `) + fileAndNumberColor(`${file}(${line},${character})`) + messageColor(":"),
    `${message}  ${messageColor.underline(`TS${code}`)}`,
    "",
    frame,
  ].join(os.EOL);
}

export default formatter;
