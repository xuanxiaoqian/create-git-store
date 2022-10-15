# create-git-store

   <a href="https://www.npmjs.com/package/create-git-store">
    <img src="https://img.shields.io/npm/v/create-git-store.svg">
  </a>



帮助你快速初始化git远程模板

<hr />



## 使用

使用npm

~~~sh
npm init git-store <项目名称> <远程地址> [分支名]

# 示例
npm init git-store project-git https://gitee.com/xuanxiaoqian/qian-cli.git master
~~~



## 作用

修改项目文件夹为你输入的`项目名称`，删除`.git文件夹`，修改`package.json`里面的内容分别为

~~~json
{
  "name": <项目名称>,
  "version": "0.0.0",
  "description": "",
}
~~~