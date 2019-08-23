const path = require("path");
const logWebpackConfigPlugin = require('./hack/craco-plugin-log-webpack-config')
module.exports = function (args) {
  return {
    eslint: {
      enable: true /* (default value) */,
      mode: "extends" /* (default value) */ || "file",
      configure: { /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */ },
      configure: (eslintConfig, { env, paths }) => { 
        eslintConfig = {...eslintConfig, rules: {'no-useless-constructor': 'off'}}
        return eslintConfig; 
      }
  },
    webpack: {
      alias: {
        "src": path.resolve(__dirname, "src/"),
        "core": path.resolve(__dirname, "src/core/"),
        "routes": path.resolve(__dirname, "src/routes/"),
        "data": path.resolve(__dirname, "src/data/"),
        "components": path.resolve(__dirname, "src/components/"),
        "store": path.resolve(__dirname, "src/store/"),
        "api": path.resolve(__dirname, "src/api/"),
        "layouts": path.resolve(__dirname, "src/layouts/"),
        "models": path.resolve(__dirname, "src/models/"),
        "assets": path.resolve(__dirname, "src/assets/"),
        "config": path.resolve(__dirname, "src/config/"),
        "constants": path.resolve(__dirname, "src/constants/"),
        "containers": path.resolve(__dirname, "src/containers/"),
        "locales": path.resolve(__dirname, "src/locales/"),
        "socialEngine": path.resolve(__dirname, "src/socialEngine/"),
      }
    },
    plugins: [
      { plugin: logWebpackConfigPlugin, options: { } }
    ]
  }
}