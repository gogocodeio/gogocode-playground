const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const {
  override,
  addLoader,
  addPlugin,
  addPostcssPlugins
} = require('@ali/customize-cra-extra');

module.exports = {
  config_overrides: {
    webpack(config, env) {
      return override(
        addPlugin(
          new MonacoWebpackPlugin()
        ),
        addPostcssPlugins([
          require('tailwindcss'),
          require('autoprefixer'),
        ]),
        addLoader({
          test: /\.(ttf|eot|svg|woff|woff2)$/,
          include: /node_modules/,
          use: [{
            loader: 'url-loader',
          }]
        }),
      )(config, env);
    }
  },
  // unstable_env: {
  //   FAST_REFRESH: false
  // }
};