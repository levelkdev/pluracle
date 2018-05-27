const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const SignedOracleFactory = artifacts.require("SignedOracleFactory.sol");
const SimpleOracleFactory = artifacts.require("SimpleOracleFactory.sol");
const PluracleFactory = artifacts.require("PluracleFactory.sol");
const OracleRegistry = artifacts.require("OracleRegistry.sol");
const SignedOracle = artifacts.require("SignedOracle.sol");
const SimpleOracle = artifacts.require("SimpleOracle.sol");
const Pluracle = artifacts.require("Pluracle.sol");

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract( 'Deploy Kovan', function ([registryOwner, factoryOwner, oracleOwner_0, oracleOwner_1, oracleOwner_2, oracleOwner_3]) {
  let signedOracle;
  let signature;

  const REWARD = 10;
  const TIME_DELAY_ALLOWED = '3600';

  function getTime() {
    return Math.floor(Date.now() / 1000);
  }

  it.skip('Update. Expect ok', async () => {

    console.log('Create regsitry and factories');
    registry = await OracleRegistry.new();
    signedOracleFactory = await SignedOracleFactory.new(registry.address);
    // simpleOracleFactory = await SimpleOracleFactory.new(registry.address, {from: registryOwner});
    // pluracleFactory = await PluracleFactory.new(registry.address, {from: registryOwner});
    await registry.adminAddRole(signedOracleFactory.address, "factory");
    // await registry.adminAddRole(simpleOracleFactory.address, "factory");
    // await registry.adminAddRole(pluracleFactory.address, "factory");

    const createTx = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "Testing SignedOracle",
      {value: 1000}
    );
    const newOracleAddr = createTx.logs[0].args.addr;
    const signedOracle = await SignedOracle.at(newOracleAddr);

    assert.equal(await signedOracle.owner(), registryOwner);

    const dataUploaded = 120;
    const timestamp = getTime()
    const message = await web3.utils.soliditySha3({type: 'uint256', value: dataUploaded}, {type: 'uint256', value: timestamp});
    const messageSigned = web3.eth.accounts.sign(message, "0x46a059700a7077b8c530809c85168b16d1774678d94ceedf9872365e85ca5de1");
    signature = messageSigned.signature;
    await signedOracle.update(dataUploaded, timestamp, signature);

    const oracleInfo = await registry.getOracleInfo(newOracleAddr);
    const oracleList = await registry.getOracleList("signed:uint256");

    assert.equal(oracleList[0], newOracleAddr);
    assert.equal(oracleInfo[0], registryOwner);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "Testing SignedOracle");
    assert.equal(parseInt(oracleInfo[3]), dataUploaded);

  })

})
