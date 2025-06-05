import * as path from 'path';
import { rspack } from '@rspack/core';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default {
  mode: 'development' as const,
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devServer: {
    port: 3004,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  output: {
    uniqueName: 'loan',
    publicPath: 'auto',
    clean: true,
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset' as const,
      },
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css' as const,
      },
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: true,
                  refresh: false,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    new ModuleFederationPlugin({
      name: 'loan',
      filename: 'remoteEntry.js',
      exposes: {
        './LoanCalculator': './src/components/LoanCalculator',
        './App': './src/App',
      },
      shared: {
        react: { 
          singleton: true, 
          eager: true,
          requiredVersion: '^18.2.0'
        },
        'react-dom': { 
          singleton: true, 
          eager: true,
          requiredVersion: '^18.2.0'
        },
        'common-utils': { singleton: true, eager: true },
        rxjs: { singleton: true, eager: true },
      },
    }),
  ],
};