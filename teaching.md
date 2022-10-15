# 从一个简单的初始化远程git仓库工具开始学习前端脚手架的建设



## 1. 开篇

在开始之前我们得知道我们要做的东西是什么样的 ->  一个能根据git地址初始化远程仓库的工具

说到这里你就会说：“git不是提供了一个clone命令给你用吗？”

ok，那我们用clone来看一下他和我们的预期有什么不同



使用clone来下载远程仓库

~~~git
git clone https://gitee.com/xiao-koa/xiao-koa-demo.git
~~~

我们来看看有什么缺陷

1. 项目文件夹的名字不是我们自己定义的
2. 项目的.git文件存在
3. package.json内容不是初始化的 例如：name、version、description...



上诉就是git克隆存在的问题，可能到这你会说动手改一下就好了，何必多此一举去做一个工具。但你点开这篇文章不就是为了学习吗？我们只是举个简单的例子让你体会前端开发工具的流程，在这个基础上你可以随心所欲做你想做的工具，成为别人口中的黑客小子（不是）



ok那么废话不多说直接开始！！！



## 2. 前提

在学习之前，我们得去看一下世面上的初始化类npm工具有哪些，并且他们的使用方法是什么样的

1. vue-cli

   ~~~sh
   # vue脚手架，用于初始化vue项目
   
   # 1. 先全局安装
   npm install -g @vue/cli
   
   # 2. 再使用
   vue create vue01
   ~~~

2. vite

   ~~~sh
   # 新型前端构建工具
   
   # 1. 直接使用
   npm init vite
   ~~~

   

可以看到 vite 比 vue-cli 简单便捷，我们来看下npm init xxx做了什么

首先我们使用 init 随便输入一个不存在的包名

~~~sh
npm init woshizhendeshuai
~~~

随后就报错了

~~~sh
C:\Users\Administrator>npm init woshizhendeshuai
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/create-woshizhendeshuai - Not found
npm ERR! 404
npm ERR! 404  'create-woshizhendeshuai@latest' is not in this registry.
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\Administrator\AppData\Local\npm-cache\_logs\2022-10-15T02_59_27_512Z-debug-0.log
~~~

从上面就可以看出来是没有找到这个包名`create-woshizhendeshuai@latest`,原来使用 init 的时候npm会帮我们自动在名字前面加上create-，所以我们想要使用这个功能就需要将库的名字前面加上create-，至于那个@latest是指下载版本最新包。

关于npm init xxx我们就暂时讲到这里，后面就够用了，有兴趣的请自行查阅相关文章。



## 3. 初始化

从上面可以看出使用npm init xxx还是很方便的，所以我们这个项目就用这个功能。

1. 新建文件夹，名称为create-git-store，注意：`必须使用create开头`

2. 初始化项目

   ~~~sh
   npm init -y && npm i typescript --save-dev && npx tsc --init && npm i --save-dev @types/node
   ~~~


3. 在项目里面新建`src`文件夹，在文件夹下面创建`index.ts`

   ~~~ts
   #!/usr/bin/env node
   console.log('hello utils');
   ~~~

4. 在`package.json`的scripts里面添加

   ~~~json
     "scripts": {
       "dev": "npx ts-node ./src/index.ts"
     },
   ~~~

5. 运行npm run dev，如果你在控制台看到输出字符就代表你大功告成了！！！

   ~~~sh
   PS E:\轩小浅\create-git-store> npm run dev
   
   > create-git-store@1.0.0 dev
   > npx ts-node ./src/index.ts
   
   hello utils
   ~~~

   





## 4. 解析命令

我们的命令是设计成这样的

~~~sh
npm init git-store project https://gitee.com/xuanxiaoqian/qian-cli.git mater

npm init git-store <项目名称> <远程地址> [分支名]
~~~

其中项目名称和远程地址为必填项，分支名不填默认master。那我们怎么样才能获取到这些参数呢？社区有一个开源库`commander`为我们解决了这个问题



下载`commander`

~~~sh
npm install commander 
~~~



使用

~~~ts
#!/usr/bin/env node
import { program } from "commander"; // 导入

program
  .command("<app-name> [gitConfig...]")
  .description("初始化远程模板")
  .action((name: string, gitConfig: string[]) => {
    console.log(name);
    console.log(gitConfig);
  });

program.parse(process.argv);	// 必须解析
~~~

上面代码很简单，我们一步一步看
先导入commander的`program`

然后在program身上链式调用添加属性

1. ~~~ts
   program.command("<app-name> [gitConfig...]") //解析的命令
   
   // 尖括号为必填参数，方括号为选填参数，方括号参数里面的 “...” 表示可以有多个参数
   
   // 当我们使用npm init git-store project xxx mater的时候，其中project参数就给到了app-name，后面的参数就当成一个数组给到了gitConfig
   ~~~

2. ~~~ts
   program.description("初始化远程模板")	// 命令的描述
   
   // 当我们使用npm init git-store --help就可以在里面看到
   ~~~

3. ~~~ts
   program.action((name: string, gitConfig: string[]) => {	// 当用户输入了命令后的回调函数
       console.log(name);
       console.log(gitConfig);
     });
   ~~~

4. ~~~ts
   program.parse(process.argv);	// 解析命令
   ~~~

   

然后我们去调试代码，首先在`package.json`的scripts里面添加

~~~json
"bin": {
    "git-store": "./src/index.js"
},
"scripts": {
    "build": "npx tsc ./src/index.ts"
},
~~~

其中`bin`代表工具性质的npm包，一定有`bin`字段，对外暴露脚本命令。



然后运行下面命令

~~~sh
npm run build && npm link
~~~

其中link表示将当前包链接到全局



做完上述之后我们来到控制台运行`git-store project xxx`

然后你就会得到一个错误 ......

~~~sh
C:\Users\Administrator>git-store project xxx
error: unknown command 'project'
~~~

说没有找到`project`命令，我猜可能是`commander`需要一个解析开头，我们将`index.ts`修改一下

~~~sh
#!/usr/bin/env node
import { program } from "commander"; // 导入

program
  .command("init <app-name> [gitConfig...]")
  .description("初始化远程模板")
  .action((name: string, gitConfig: string[]) => {
    console.log(name);
    console.log(gitConfig);
  });

program.parse(process.argv);	// 必须解析
~~~

再来到控制台运行`git-store init project xxx`就可以看到没有报错并且正确的打印了参数

可这不是我们想要的，然后我就去看了vite官方源码，其中它是用`minimist`实现的，那我们也只好换工具库（别打我）



一系列操作

~~~sh
# 卸载commander
npm uninstall commander

# 安装minimist
npm install minimist

# 安装minimist的ts声明文件
npm i --save-dev @types/minimist
~~~



修改`src/index.ts`

~~~ts
#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2), { string: ["_"] });

console.log(argv);
~~~



运行npm run build，然后报错

~~~sh
src/index.ts:3:8 - error TS1259: Module '"E:/\u8F69\u5C0F\u6D45/create-git-store/node_modules/@types/minimist/index"' can only be default-imported using the 'esModuleInterop' flag
~~~

经过搜寻，发现是tsc编译的问题，[问题详细](https://stackoverflow.com/questions/62273153/this-module-is-declared-with-using-export-and-can-only-be-used-with-a-defau) 最终我们选择esbuild来打包，并且esbuild还能减少打包等待时间

`tips：不要嫌BUG多，现在把坑踩了以后遇到了就不会再头疼`



下载esbuild

~~~sh
npm install esbuild --save-dev
~~~

在项目根目录添加一个`build.js`文件

~~~js
const esbuild = require("esbuild");

const build = async function () {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    splitting: false,
    outfile: "src/index.js",
    format: "cjs",
    platform: "node",
    target: "node14",
  });
  console.log("打包成功!");
};

build();
~~~



修改`package.json`的scripts为

~~~json
"scripts": {
    "build": "node build.js"
},
~~~



运行npm run build就可以看到打包成功了，在控制台运行`git-store project xxx master`就可以看到输出的内容

~~~sh
C:\Users\Administrator>git-store project xxx master
{ _: [ 'project', 'xxx', 'master' ] }
~~~

到此为止解析命令就完成了



## 5. 执行命令

上一步已经拿到了参数，首先我们需要做一些前置过滤，只有用户输入的是正确的才去运行脚本

1. 解析的参数数组长度必须 >=2
2. 数组第二个的地址必须是git地址



ok我们来到代码解决这些

~~~ts
#!/usr/bin/env node

import minimist from "minimist";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const argv = minimist(process.argv.slice(2), { string: ["_"] });

console.log(argv._);

if (argv._.length < 2) {
    console.log("输入命令有误");
    process.exit(0);
}

let projectName = argv._[0];
let gitRemote = argv._[1];
let gitBranch = argv._[3] ?? “master”;

let regex = new RegExp(/^http(s)?:\/\/.*\.git$/);
if (!regex.test(gitRemote)) {
    console.log(`无效git地址${gitRemote},必须以.git结尾`);
    process.exit(1);
}

console.log("可以执行命令了");
~~~



然后就是根据用户的参数去下载远程模板，我现在知道的有三种方法下载

1. 使用[download-git-repo](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fdownload-git-repo)库下载
2. 使用axios下载（gitee不可用）
3. 通过clone下载

我来说下我用这些分别遇到的问题。使用[download-git-repo](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fdownload-git-repo)库下载的时候报错不能捕捉。使用axios下载局限性太大。所以我最终选择了通过git提供的clone下载

node原生提供了一个库可以模拟用户执行命令

~~~ts
import { exec } from 'child_process'

exec('echo "hello"',(err, stdout, stderr) => {
    if (err) {
        console.log(red(`报错原因：${err}`))
        process.exit(1)
    }

    process.exit(1)
},
~~~



我们拿着这个库来运行clone命令

~~~ts
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
~~~

`注意，我们尽量不要用外部工具，这样就可以让我们库的体积特别小，用户运行下载才会更快`

测试下功能完好，至此我们的功能基本做完了，短短70几行代码就打开了你做前端工具的思路，是不是觉得特别值呢？



现在就到了最期待的任务线 —— 发布到npm上让其他小朋友能够使用并成为他们眼中的黑客小子

修改`package.json`，全部示例：

~~~json
{
  "name": "create-git-store",
  "version": "1.0.0",
  "description": "帮助你快速初始化git远程模板",
  "main": "index.js",
  "bin": {
    "git-store": "./src/index.js"
  },
  "file": [
    "src/index.js"
  ],
  "scripts": {
    "dev": "npx ts-node ./src/index.ts",
    "build": "node build.js"
  },
  "keywords": [
    "create-git-store",
    "git-store",
    "xuanxiaoqian"
  ],
  "author": "xuanxiaoqian",
  "license": "MIT",
  "devDependencies": {
    "@types/minimist": "^1.2.2",
    "@types/node": "^18.11.0",
    "esbuild": "^0.15.11",
    "typescript": "^4.8.4"
  },
  "dependencies": {
    "minimist": "^1.2.7"
  }
}
~~~



然后执行`npm publish`，如果你本地还没登录需要输入用户名密码登录。至于怎么注册npm和登录发布包这里就不多说了。

然后本地就可以去使用你的包了

~~~sh
npm init git-store project-git https://gitee.com/xuanxiaoqian/qian-cli.git master
~~~





## 6. 流水化

你以为上面那些就完了？不不不，真正的干货还在后面。

上面的仅仅是最基本的功能实现，如果你后续要修改一点东西重新发布怎么办？

1. 打包代码
2. 修改`package.json`的version（npm不能发布低于现有版本）
3. 发布到npm



你可能又说：“就这就这？我不偷懒我手动做，咋啦！”  那万一你还将代码放到github上呢？万一你代码在gitee和github上都有呢？还要git add、git commit、git push ......

我就问你麻不麻烦？ok，我们接下来解决这些问题

理想中的状态是运行`npm publish`就将上面所有的事情全部做完，好巧不巧，npm有一个钩子函数`prepublishOnly`，执行`npm publish`的时候会先运行`prepublishOnly`，那这个东西在哪呢？就在`package.json`的scripts里面：

~~~json
"scripts": {
    "prepublishOnly": "node test.js"
},
~~~

去执行一下`npm publish`就会先运行test.js文件，再帮你push到npm上



但是我们不用node去做，而是用一个库`zx`，有些小伙伴可能听说过这个，之前很有名气，能让你在 Node 中编写 Shell 脚本库

我们来下载

~~~sh
npm install zx --save-dev
~~~



在根目录添加`prepublish.mjs`

~~~js
#!/usr/bin/env zx
import 'zx/globals'

await $`echo 123`
~~~



运行`npx zx prepublish.mjs`

就可以看到控制台输出信息了



那么技巧交给你了，你知道接下来怎么做了吧。这里给到我写的

~~~js
#!/usr/bin/env zx
import "zx/globals";

await $`npm run build`;

let { version } = JSON.parse(fs.readFileSync("./package.json"));
let _data = JSON.parse(fs.readFileSync("./package.json"));

let v = _data.version.split(".").map(Number);

v[v.length - 1] += 1;

_data.version = v.join(".");

fs.writeFileSync("./package.json", JSON.stringify(_data, null, 2));

console.log(`版本号： ${version} -> ${_data.version}`);

await $`git add .`;

await $`git commit -m "版本号: ${_data.version}"`;

await $`git push gitee master`;

try {
    await $`git push github master`
  } catch (error) {}

console.log(`版本号： ${version} -> ${_data.version}`);
~~~



上面就是本篇文章的全部内容啦，如果你从上面写下来遇到的错误解决不了。可以去看一下我写好的 [仓库(gitee)](https://gitee.com/xuanxiaoqian/create-git-store)对比一下

最后就是该篇文章在`哔哩哔哩`后续有讲解 [传送](https://space.bilibili.com/473254123/?spm_id_from=333.999.0.0)欢迎关注一下呀~



哔哩哔哩：[地址](https://space.bilibili.com/473254123/?spm_id_from=333.999.0.0)

gitee: [地址](https://gitee.com/xuanxiaoqian/create-git-store)