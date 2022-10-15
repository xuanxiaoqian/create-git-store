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
