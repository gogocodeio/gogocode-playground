const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const {
  override,
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
        ])
      )(config, env);
    }
  },
  // unstable_env: {
  //   FAST_REFRESH: false
  // }
};