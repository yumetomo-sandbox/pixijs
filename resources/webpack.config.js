const path = require("path");
const webpack = require("webpack");

module.exports = {
  // エントリーポイントの設定
  entry: {
    vendor: ["jquery", "velocity-animate", "underscore"],
    index: path.join(__dirname, "webpack/index.js"),
    snow: path.join(__dirname, "webpack/snow.js")
  },
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: "[name].bundle.js",
    // 出力先のパス
    path: path.join(__dirname, "../app/webroot/js/")
  },
  // ローダーの設定
  module: {
    rules: [
      {
        // ローダーの対象ファイル
        test: /\.js$/,
        // ローダーの対象から外すディレクトリ
        exclude: /node_modules/,
        // 利用するローダー
        use: "babel-loader?presets[]=es2015"
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor"
    })
  ]
};
