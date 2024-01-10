#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const open = require("open");
const { exec } = require("child_process");
const readline = require("readline");
const configFilePath = path.resolve(process.cwd(), "bada.config.json");
let config = null;

const displayIntro = () => {
  console.log(
    chalk.greenBright(
      figlet.textSync("SOMANSA", {
        font: "roman",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    ) + "\n"
  );
  console.log(
    chalk.redBright(
      figlet.textSync("  <  BADA-CLI  >", {
        font: "rozzo",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
};

const loadConfig = async () => {
  try {
    const data = await fs.promises.readFile(configFilePath, "utf-8");
    config = JSON.parse(data);
    console.log("Read config:", config);
  } catch (err) {
    console.error(`Error reading bada.config.json file: ${err.message}`);
  }
};

const typeQuestions = () => {
  const questions = [
    {
      type: "input",
      name: "TYPE",
      message: chalk.red(">"),
    },
  ];
  return inquirer.prompt(questions);
};

const askQuestions = () => {
  const questions = [
    {
      type: "list",
      name: "INPUT",
      message: "키보드 무브 후 엔터~!",
      choices: [
        "1.Change_node_version",
        "2.Webpack_build",
        "3.Postcss_build",
        "4.Back",
      ],
      filter: function (val) {
        return val.split(".")[1];
      },
    },
  ];
  return inquirer.prompt(questions);
};

function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  console.log("Enter version No");
  return new Promise((resolve) => {
    rl.question(``, (answer) => {
      rl.close();
      const selected = answer;
      resolve(selected);
    });
  });
}

const run = async () => {
  displayIntro();
  await loadConfig();

  console.log();
  console.log(chalk.red(" Welcome SOMANSA! This is BADA CLI."));
  console.log(chalk.grey(" (웹팩 빌드를 간편하게 도와드리겠습니다.)"));
  console.log(chalk.whiteBright(` Type 'h' for a list of commands.`));

  while (true) {
    const typed_answer = await typeQuestions();
    const { TYPE } = typed_answer;
    if (TYPE === "h") {
      console.log(
        ">" +
          chalk.greenBright(" h") +
          ": Show a list of commands.\n" +
          ">" +
          chalk.greenBright(" i") +
          ": Information.\n" +
          ">" +
          chalk.greenBright(" m") +
          ": Menu - show multiple choices.\n" +
          ">" +
          chalk.greenBright(" c") +
          ": Contact github pages.\n" +
          ">" +
          chalk.greenBright(" e") +
          ": Exit the program."
      );
    } else if (TYPE === "m") {
      const picked_answer = await askQuestions();

      const { INPUT } = picked_answer;
      if (INPUT === "Change_node_version") {
        exec("nvm list", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error fetching nvm list: ${error.message}`);
            return;
          }

          const versions = stdout.split("\n");
          let version_list = [];
          // nvm 목록 출력
          console.log("Available Node.js versions:");
          const versionRegex = /\b(\d+\.\d+\.\d+)\b/;
          let idx = 1;
          versions.forEach((version, index) => {
            if (version != "") {
              const match = version.match(versionRegex);
              console.log(
                `${idx++}) ${match[0]}`,
                version.includes("*") ? "*" : ""
              );
              version_list.push(match[0]);
            }
          });

          // 사용자에게 선택하도록 안내
          getUserInput()
            .then((selectedVersion) => {
              if (selectedVersion) {
                // 선택한 버전으로 nvm use 명령어 실행
                exec(
                  `nvm use ${version_list[selectedVersion - 1]}`,
                  (error, stdout, stderr) => {
                    if (error) {
                      console.error(
                        `Error executing command: ${error.message}`
                      );
                      console.log(`엔터키를 입력하세요.`);
                      return;
                    }
                    console.log(`Command output: ${stdout}`);
                    console.log(`엔터키를 입력하세요.`);
                  }
                );
              } else {
                console.log("Invalid selection.");
                console.log(`엔터키를 입력하세요.`);
              }
            })
            .catch((err) => {
              console.error(`Error getting user input: ${err.message}`);
              console.log(`엔터키를 입력하세요.`);
            });
        });
      } else if (INPUT === "Webpack_build") {
        var obj = config.find((item) => item.key === INPUT);
        exec(
          obj.cmd, // "cd /d D:\\git-dlpcenter\\DLPCenter.View.Web\\frontend && npm run bundle",
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error fetching webpack: ${error.message}`);
              console.log(`엔터키를 입력하세요.`);
              return;
            }
            console.log(`Command output: ${stdout}`);
            console.log(`엔터키를 입력하세요.`);
          }
        );
      } else if (INPUT === "Postcss_build") {
        var obj = config.find((item) => item.key === INPUT);
        exec(
          obj.cmd, // "cd /d D:\\git-dlpcenter\\DLPCenter.View.Web\\postcss && npm run build"
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error fetching postcss: ${error.message}`);
              console.log(`엔터키를 입력하세요.`);
              return;
            }
            console.log(`Command output: ${stdout}`);
            console.log(`엔터키를 입력하세요.`);
          }
        );
      } else if (INPUT === "Back") {
        console.log();
      }
    } else if (TYPE === "i") {
      console.log(
        chalk.green(" 제작") +
          ": 김정환\n" +
          chalk.green(" 목적") +
          ": 웹팩 빌드를 간편하게 수행. 바다님 전용 툴.\n" +
          chalk.green(" 메일") +
          ": hwantagexsw2@gmail.com\n" +
          chalk.green(" 기능") +
          ": 1) 웹팩 빌드 수행 (CSS번들링 후 파일을 합쳐 POSTCSS 폴더에 결과 파일 저장)\n" +
          "     : 2) node 버전 변경\n" +
          "     : 3) POSTCSS 로 중복 정의 제거 후 최종 폴더에 deploy\n"
      );
    } else if (TYPE === "c") {
      await open("https://github.com/hwantage/bada-cli");
    } else if (TYPE === "e") {
      console.log(" Good bye! See you next. :) ");
      break;
    } else if (TYPE === "") {
      console.log(chalk.red(" If you are lost, type 'h'!"));
    } else {
      console.log(
        " No command detected under that input.\n" +
          " Please check your input.\n" +
          chalk.red(' Type "h" for commands.')
      );
    }
    console.log();
  }
};

run();
