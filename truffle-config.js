require('babel-register');
require('babel-polyfill');
const { projectId, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    mumbai: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.infura.io/v3/${projectId}`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/${projectId}`),
      network_id: '5',
      gas: 4465030,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mainnet.infura.io/v3/${projectId}`),
      network_id: 137,
      confirmations: 3,
      timeoutBlocks: 200,
      skipDryRun: true
  }

  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.6.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
