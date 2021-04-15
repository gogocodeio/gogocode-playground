const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const {
  override,
  addLoader,
  addPlugin,
  addPostcssPlugins,
  addLessLoader,
} = require('@ali/customize-cra-extra');

module.exports = {
  config_overrides: {
    webpack(config, env) {
      return override(
        addPlugin(new MonacoWebpackPlugin()),
        // 在开发中为了兼容 vscode，采用一个 chunk，避免二次获取 js
        env === 'development' &&
          addPlugin(
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1,
            }),
          ),
        addPostcssPlugins([require('tailwindcss'), require('autoprefixer')]),
        addLessLoader({
          lessOptions: {
            javascriptEnabled: true,
          },
        }),
        addLoader({
          test: /\.(ttf|eot|svg|woff|woff2)$/,
          include: /node_modules/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        }),
      )(config, env);
    },
  },
  unstable_env: {
    GENERATE_SOURCEMAP: false,
  },
};
