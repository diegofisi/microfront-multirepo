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
    },
    'react-dom': {
      singleton: true,
      eager: true,
    },
    'common-utils': { singleton: true, eager: true },
    rxjs: { singleton: true, eager: true },
  },
};
