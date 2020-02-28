const path = require("path");
const webpackBase = require("./webpack.config");
const webpackMerge = require("webpack-merge");

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = webpackMerge.smart(webpackBase, {
  entry: {
    background: "./src/extension/background.ts",
    connect: "./src/extension/connect.ts"
  },
  output: {
    path: path.resolve("./extension")
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./static"
      }
    ])
  ]
});
