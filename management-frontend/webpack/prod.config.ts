import * as path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export default () => ({
  mode: "production",
  entry: {
    bundle: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".mjs"],
    alias: {
      "@reusable": path.resolve("src", "components"),
      "@assets": path.resolve("src", "assets"),
    },
  },
  output: {
    clean: true,
    filename: "bundle.[contenthash].min.js",
    path: path.resolve(__dirname, "..", "dist"),
    sourceMapFilename: "[name].js.map",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          compress: false,
          keep_fnames: true,
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      filename: "index.html",
      template: "public/index.html",
      publicPath: "/",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/images", to: "images" },
        { from: "public/locales", to: "locales" },
      ],
    }),
  ],
});
