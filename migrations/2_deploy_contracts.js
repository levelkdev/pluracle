var SignedOracle = artifacts.require("./SignedOracle.sol");


const web3 = require('web3')

module.exports = function(deployer) {
  const REWARD = web3.utils.toWei('1', 'ether')
  const TIME_DELAY_ALLOWED =web3.utils.toBN(3600); // 1 hour
  const DATA_TYPE = 'int';
  deployer.deploy(SignedOracle, REWARD, TIME_DELAY_ALLOWED, DATA_TYPE );
};
