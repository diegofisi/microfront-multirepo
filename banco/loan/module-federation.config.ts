export const mfConfig = {
  name: 'loan',
  exposes: {
    './LoanCalculator': './src/components/LoanCalculator',
    './App': './src/App',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: '^19.0.0',
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: '^19.0.0',
    },
    'common-utils': { singleton: true, eager: true },
    rxjs: { singleton: true, eager: true },
  },
};
