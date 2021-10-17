const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/cmd/deploy.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "deploy.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
