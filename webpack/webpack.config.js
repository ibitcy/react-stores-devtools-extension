const path = require("path");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false
  },

  target: "web",
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".html", ".txt"],
    modules: ["node_modules", "./src"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(svg|png|jp(e*)g)$/,
        loader: "url-loader",
        options: {
          limit: false,
          name: "[hash]-[name].[ext]"
        }
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
};
