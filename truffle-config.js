require('dotenv').config({ path: __dirname + '/.env' });
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => {
        if (!process.env.MNEMONIC) {
          throw new Error('MNEMONIC not set in .env file');
        }
        return new HDWalletProvider(process.env.MNEMONIC, 'https://eth-sepolia.g.alchemy.com/v2/qD5r7Nuba4befcaZUNqsY');
      },
      network_id: 11155111,
      gas: 10000000,
      gasPrice: 20000000000,
      networkCheckTimeout: 60000,
      networkRetryTimeout: 30000
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  },
  plugins: ['truffle-plugin-verify']
};