const CentralizedOracleFactory = artifacts.require('CentralizedOracleFactory')
const SignedOracleFactory = artifacts.require('SignedOracleFactory')
const OracleRegistry = artifacts.require('OracleRegistry')
const UintPluracle = artifacts.require('UintPluracle')
const ComposableOracle = artifacts.require('ComposableOracle')

const reward = 200
const timeDelayAllowed = 5
const dataType = "uint256"
const maximumUpdateFrequency = 100

// const oracles = []
// const challengeAmounts = []
// const challenPeriod = 500

module.exports = function (deployer) {
  deployer.then(() => {
    return CentralizedOracleFactory.new(dataType)
  }).then(() => {
    return SignedOracleFactory.new(reward, timeDelayAllowed, dataType)
  }).then(() => {
    return OracleRegistry.new()
  }).then(() => {
    return UintPluracle.new(reward, maximumUpdateFrequency)
  }).then(() => {
    // TODO add ComposableOracle to deploy
    // return ComposableOracle.new(oracles, challengeAmounts, challengePeriod)
  })
};
