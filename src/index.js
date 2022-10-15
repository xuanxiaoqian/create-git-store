#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/minimist/index.js
var require_minimist = __commonJS({
  "node_modules/minimist/index.js"(exports, module2) {
    module2.exports = function(args, opts) {
      if (!opts)
        opts = {};
      var flags = { bools: {}, strings: {}, unknownFn: null };
      if (typeof opts["unknown"] === "function") {
        flags.unknownFn = opts["unknown"];
      }
      if (typeof opts["boolean"] === "boolean" && opts["boolean"]) {
        flags.allBools = true;
      } else {
        [].concat(opts["boolean"]).filter(Boolean).forEach(function(key2) {
          flags.bools[key2] = true;
        });
      }
      var aliases = {};
      Object.keys(opts.alias || {}).forEach(function(key2) {
        aliases[key2] = [].concat(opts.alias[key2]);
        aliases[key2].forEach(function(x) {
          aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
            return x !== y;
          }));
        });
      });
      [].concat(opts.string).filter(Boolean).forEach(function(key2) {
        flags.strings[key2] = true;
        if (aliases[key2]) {
          flags.strings[aliases[key2]] = true;
        }
      });
      var defaults = opts["default"] || {};
      var argv2 = { _: [] };
      Object.keys(flags.bools).forEach(function(key2) {
        setArg(key2, defaults[key2] === void 0 ? false : defaults[key2]);
      });
      var notFlags = [];
      if (args.indexOf("--") !== -1) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
      }
      function argDefined(key2, arg2) {
        return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
      }
      function setArg(key2, val, arg2) {
        if (arg2 && flags.unknownFn && !argDefined(key2, arg2)) {
          if (flags.unknownFn(arg2) === false)
            return;
        }
        var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
        setKey(argv2, key2.split("."), value2);
        (aliases[key2] || []).forEach(function(x) {
          setKey(argv2, x.split("."), value2);
        });
      }
      function setKey(obj, keys, value2) {
        var o = obj;
        for (var i2 = 0; i2 < keys.length - 1; i2++) {
          var key2 = keys[i2];
          if (isConstructorOrProto(o, key2))
            return;
          if (o[key2] === void 0)
            o[key2] = {};
          if (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype)
            o[key2] = {};
          if (o[key2] === Array.prototype)
            o[key2] = [];
          o = o[key2];
        }
        var key2 = keys[keys.length - 1];
        if (isConstructorOrProto(o, key2))
          return;
        if (o === Object.prototype || o === Number.prototype || o === String.prototype)
          o = {};
        if (o === Array.prototype)
          o = [];
        if (o[key2] === void 0 || flags.bools[key2] || typeof o[key2] === "boolean") {
          o[key2] = value2;
        } else if (Array.isArray(o[key2])) {
          o[key2].push(value2);
        } else {
          o[key2] = [o[key2], value2];
        }
      }
      function aliasIsBoolean(key2) {
        return aliases[key2].some(function(x) {
          return flags.bools[x];
        });
      }
      for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (/^--.+=/.test(arg)) {
          var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
          var key = m[1];
          var value = m[2];
          if (flags.bools[key]) {
            value = value !== "false";
          }
          setArg(key, value, arg);
        } else if (/^--no-.+/.test(arg)) {
          var key = arg.match(/^--no-(.+)/)[1];
          setArg(key, false, arg);
        } else if (/^--.+/.test(arg)) {
          var key = arg.match(/^--(.+)/)[1];
          var next = args[i + 1];
          if (next !== void 0 && !/^-/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
            setArg(key, next, arg);
            i++;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next === "true", arg);
            i++;
          } else {
            setArg(key, flags.strings[key] ? "" : true, arg);
          }
        } else if (/^-[^-]+/.test(arg)) {
          var letters = arg.slice(1, -1).split("");
          var broken = false;
          for (var j = 0; j < letters.length; j++) {
            var next = arg.slice(j + 2);
            if (next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
              setArg(letters[j], next.split("=")[1], arg);
              broken = true;
              break;
            }
            if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
              setArg(letters[j], next, arg);
              broken = true;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg);
              broken = true;
              break;
            } else {
              setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
            }
          }
          var key = arg.slice(-1)[0];
          if (!broken && key !== "-") {
            if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
              setArg(key, args[i + 1], arg);
              i++;
            } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
              setArg(key, args[i + 1] === "true", arg);
              i++;
            } else {
              setArg(key, flags.strings[key] ? "" : true, arg);
            }
          }
        } else {
          if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
            argv2._.push(
              flags.strings["_"] || !isNumber(arg) ? arg : Number(arg)
            );
          }
          if (opts.stopEarly) {
            argv2._.push.apply(argv2._, args.slice(i + 1));
            break;
          }
        }
      }
      Object.keys(defaults).forEach(function(key2) {
        if (!hasKey(argv2, key2.split("."))) {
          setKey(argv2, key2.split("."), defaults[key2]);
          (aliases[key2] || []).forEach(function(x) {
            setKey(argv2, x.split("."), defaults[key2]);
          });
        }
      });
      if (opts["--"]) {
        argv2["--"] = new Array();
        notFlags.forEach(function(key2) {
          argv2["--"].push(key2);
        });
      } else {
        notFlags.forEach(function(key2) {
          argv2._.push(key2);
        });
      }
      return argv2;
    };
    function hasKey(obj, keys) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      var key = keys[keys.length - 1];
      return key in o;
    }
    function isNumber(x) {
      if (typeof x === "number")
        return true;
      if (/^0x[0-9a-f]+$/i.test(x))
        return true;
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    function isConstructorOrProto(obj, key) {
      return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
    }
  }
});

// src/index.ts
var import_minimist = __toESM(require_minimist());
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var argv = (0, import_minimist.default)(process.argv.slice(2), { string: ["_"] });
if (argv._.length < 2) {
  console.log("\u8F93\u5165\u547D\u4EE4\u6709\u8BEF");
  process.exit(0);
}
var projectName = argv._[0];
var gitRemote = argv._[1];
var gitBranch = argv._[3] ?? "master";
var regex = new RegExp(/^http(s)?:\/\/.*\.git$/);
if (!regex.test(gitRemote)) {
  console.log(`\u65E0\u6548git\u5730\u5740${gitRemote},\u5FC5\u987B\u4EE5.git\u7ED3\u5C3E`);
  process.exit(1);
}
var removeDir = (filePath) => {
  let statObj = import_fs.default.statSync(filePath);
  if (statObj.isDirectory()) {
    let dirs = import_fs.default.readdirSync(filePath);
    dirs = dirs.map((dir) => import_path.default.join(filePath, dir));
    for (let i = 0; i < dirs.length; i++) {
      removeDir(dirs[i]);
    }
    import_fs.default.rmdirSync(filePath);
  } else {
    import_fs.default.unlinkSync(filePath);
  }
};
(0, import_child_process.exec)(`git clone -b ${gitBranch} ${gitRemote} ${projectName}`, (err) => {
  if (err) {
    console.log(`\u62A5\u9519\u539F\u56E0\uFF1A${err}`);
    process.exit(1);
  }
  removeDir(import_path.default.resolve(projectName, ".git"));
  if (import_fs.default.existsSync(import_path.default.resolve(projectName, "package.json"))) {
    let _data = JSON.parse(
      import_fs.default.readFileSync(import_path.default.resolve(projectName, "package.json"), {
        encoding: "utf-8",
        flag: "r"
      })
    );
    _data.name = projectName;
    _data.version = "0.0.0";
    _data.description = "";
    let str = JSON.stringify(_data, null, 4);
    import_fs.default.writeFileSync(`${import_path.default.resolve(projectName, "package.json")}`, str);
  }
  console.log();
  console.log("\u73B0\u5728\u8FD0\u884C:");
  console.log();
  console.log("  cd " + import_path.default.basename(projectName));
});
