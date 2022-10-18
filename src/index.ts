#!/usr/bin/env node

import minimist from "minimist";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const argv = minimist(process.argv.slice(2), { string: ["_"] });

if (argv._.length < 2) {
  console.log("输入命令有误");
  process.exit(0);
}

let projectName = argv._[0];
let gitRemote = argv._[1];
let gitBranch = argv._[3];
if (gitBranch === undefined) gitBranch = "master";

let regex = new RegExp(/^http(s)?:\/\/.*\.git$/);
if (!regex.test(gitRemote)) {
  console.log(`无效git地址${gitRemote},必须以.git结尾`);
  process.exit(1);
}

// 递归删除文件夹
const removeDir = (filePath: string) => {
  let statObj = fs.statSync(filePath);
  if (statObj.isDirectory()) {
    let dirs = fs.readdirSync(filePath);
    dirs = dirs.map((dir) => path.join(filePath, dir));
    for (let i = 0; i < dirs.length; i++) {
      removeDir(dirs[i]);
    }
    fs.rmdirSync(filePath);
  } else {
    fs.unlinkSync(filePath);
  }
};

exec(`git clone -b ${gitBranch} ${gitRemote} ${projectName}`, (err) => {
  if (err) {
    console.log(`报错原因：${err}`);

    process.exit(1);
  }

  // 删除.git
  removeDir(path.resolve(projectName, ".git"));

  // 前提是存在package.json
  if (fs.existsSync(path.resolve(projectName, "package.json"))) {
    let _data: any = JSON.parse(
      fs.readFileSync(path.resolve(projectName, "package.json"), {
        encoding: "utf-8",
        flag: "r",
      })
    );
    _data.name = projectName;
    _data.version = "0.0.0";
    _data.description = "";

    let str = JSON.stringify(_data, null, 4);
    fs.writeFileSync(`${path.resolve(projectName, "package.json")}`, str);
  }

  console.log();
  console.log("现在运行:");
  console.log();
  console.log("  cd " + path.basename(projectName));
});
