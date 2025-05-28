const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "login",
  filename: "remoteEntry.js",
  exposes: {
    "./LoginModule": "./src/app/login/login.component.ts",
    "./LoginApp": "./src/bootstrap.ts",
  },

  shared: shareAll({
    singleton: true,
    strictVersion: false,
  }),
});
