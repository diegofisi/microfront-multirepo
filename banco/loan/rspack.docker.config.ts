// loan/rspack.docker.config.cjs
const path = require('path');
const { rspack } = require('@rspack/core');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devServer: {
    port: 3004,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  output: { uniqueName: 'loan', publicPath: 'auto', clean: true },
  experiments: { css: true },
  module: {
    rules: [
      { test: /\.svg$/, type: 'asset' },
      { test: /\.css$/, use: ['postcss-loader'], type: 'css' },
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: {
                react: { runtime: 'automatic', development: true, refresh: false }
              }
            }
          }
        }
      }
    ]
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    new ModuleFederationPlugin({
      name: 'loan',
      filename: 'remoteEntry.js',
      exposes: {
        './LoanCalculator': './src/components/LoanCalculator',
        './App':            './src/App',
      },
      shared: {
        react:         { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom':   { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'common-utils':{ singleton: true, eager: true },
        rxjs:          { singleton: true, eager: true },
      },
      dts: false,  // desactiva generación de tipos en Docker
    }),
  ],
};
