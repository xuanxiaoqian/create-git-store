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
let gitBranch = argv._[3] ?? "master";

let regex = new RegExp(/^http(s)?:\/\/.*\.git$/);
if (!regex.test(gitRemote)) {
  console.log(`无效git地址${gitRemote},必须以.git结尾`);
  process.exit(1);
}

const removeDir = (filePath: string) => {
  let statObj = fs.statSync(filePath); // fs.statSync同步读取文件状态，判断是文件目录还是文件。
  if (statObj.isDirectory()) {
    //如果是目录
    let dirs = fs.readdirSync(filePath); //fs.readdirSync()同步的读取目标下的文件 返回一个不包括 '.' 和 '..' 的文件名的数组['b','a']
    dirs = dirs.map((dir) => path.join(filePath, dir)); //拼上完整的路径
    for (let i = 0; i < dirs.length; i++) {
      // 深度 先将儿子移除掉 再删除掉自己
      removeDir(dirs[i]);
    }
    fs.rmdirSync(filePath); //删除目录
  } else {
    fs.unlinkSync(filePath); //删除文件
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
