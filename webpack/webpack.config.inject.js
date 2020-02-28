const path = require("path");
const webpackMerge = require("webpack-merge");
const webpackBase = require("./webpack.config");

module.exports = webpackMerge.smart(webpackBase, {
  entry: {
    inject: "./src/extension/inject.ts"
  },
  output: {
    path: path.resolve("./tmp")
  }
});
