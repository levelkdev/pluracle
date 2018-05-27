module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 42,
      gas: 4700000
    },
    kovan: getKovanConfig()
  }
};

function getKovanConfig () {
  var HDWalletProvider = require('truffle-hdwallet-provider')
  var secrets = {}
  try {
    secrets = require('./secrets.json')
  } catch (err) {
    console.log('could not find ./secrets.json')
  }

  var kovanProvider = () => {
    const provider = new HDWalletProvider(secrets.mnemonic, 'https://kovan.infura.io/' + secrets.infura_apikey)
    return provider
  }

  return {
    network_id: 42,
    provider: kovanProvider
  }
}
