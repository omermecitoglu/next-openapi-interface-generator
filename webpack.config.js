/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
  },
  target: "node",
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: "raw-loader",
      },
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
    "handlebars",
    "swagger-jsdoc",
    "yargs",
  ],
  externalsType: "commonjs",
};
