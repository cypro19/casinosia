import * as path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export default () => ({
  entry: {
    bundle: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
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
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    allowedHosts: "all",
    historyApiFallback: true,
    port: 8001,
    compress: false,
    client: {
      progress: false,
      reconnect: true,
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "..", "dist"),
    sourceMapFilename: "[name].js.map",
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      filename: "index.html",
      template: "public/index.html",
      publicPath: "/",
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
