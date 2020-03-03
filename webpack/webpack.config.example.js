const path = require("path");
const webpackBase = require("./webpack.config");
const webpackMerge = require("webpack-merge");

module.exports = webpackMerge.smart(webpackBase, {
  entry: {
    example: "./example/example.tsx"
  },
  output: {
    path: path.resolve("./example")
  }
});
