
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const SignedOracleFactory = artifacts.require("SignedOracleFactory.sol");
const OracleRegistry = artifacts.require("OracleRegistry.sol");
const SignedOracle = artifacts.require("SignedOracle.sol");

contract('OracleRegistry and Factory', function ([owner, user, attacker]) {
  let signedOracle;
  let signature;

  const REWARD = 10
  const TIME_DELAY_ALLOWED = '3600' // 1 hour

  const DATA = 120;
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    registry = await OracleRegistry.new();
    signedOracleFactory = await SignedOracleFactory.new(registry.address);
    await registry.adminAddRole(signedOracleFactory.address, "factory");
  });

  it('Create an oracle and register it', async () => {
    const createTx = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "Testing SignedOracle",
      {value: web3.utils.toWei("1")}
    );
    const newOracleAddr = createTx.logs[0].args.addr;
    const signedOracle = await SignedOracle.at(newOracleAddr);

    assert.equal(await signedOracle.owner(), owner);

    const DATA = 120;
    const TIMESTAMP = Math.floor(Date.now() / 1000);
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, owner);
    await signedOracle.update(DATA, TIMESTAMP, signature);

    const oracleInfo = await registry.getOracleInfo(newOracleAddr);
    const oracleList = await registry.getOracleList("signed:uint256");

    assert.equal(oracleList[0], newOracleAddr);
    assert.equal(oracleInfo[0], owner);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "Testing SignedOracle");
    assert.equal(parseInt(oracleInfo[3]), DATA);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP);

  });
})
