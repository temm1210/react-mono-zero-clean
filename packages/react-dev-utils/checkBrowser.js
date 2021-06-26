import browserslist from "browserslist";
import chalk from "chalk";

// browserslist가 정의되어 있는지 확인하는 함수
function checkBrowsers(dir) {
  // browserslist 의 설정파일을 불러옴
  const current = browserslist.loadConfig({ path: dir });

  if (!current) {
    console.log(chalk.red(`Must have ${chalk.bold.red("browserslist")} in ${chalk.bold.red("package.json")} ${"\n"}Please check it`));
    process.exit(0);
  }

  return Promise.resolve(current);
}

export default checkBrowsers;
