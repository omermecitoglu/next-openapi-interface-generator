/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
  },
  target: "node",
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env -S npx tsx", raw: true }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
  },
  externals: [
    "typescript",
    "handlebars",
    "yargs",
    /^@omer-x\/next-openapi-json-generator$/,
    /^@omer-x\/openapi-code-generator$/,
  ],
  externalsType: "commonjs",
};
