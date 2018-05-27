
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const SignedOracleFactory = artifacts.require("SignedOracleFactory.sol");
const OracleRegistry = artifacts.require("OracleRegistry.sol");
const SignedOracle = artifacts.require("SignedOracle.sol");

contract('OracleRegistry and Factory', function ([registryOwner, signedFactoryOwner, signedOracleOwner_0, signedOracleOwner_1]) {
  let signedOracle;
  let signature;
  let registry;

  const REWARD = 10
  const TIME_DELAY_ALLOWED = '3600' // 1 hour

  const DATA = 120;
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    registry = await OracleRegistry.new( { from: registryOwner });
    signedOracleFactory = await SignedOracleFactory.new(registry.address,{from: signedFactoryOwner});
    await registry.adminAddRole(signedOracleFactory.address, "factory");
  });

  it('Create an oracle and register it', async () => {
    const createTx = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "Testing SignedOracle",
      {value: web3.utils.toWei("1"), from: signedOracleOwner_0 }
    );
    const newOracleAddr = createTx.logs[0].args.addr;
    const signedOracle = await SignedOracle.at(newOracleAddr);

    assert.equal(await signedOracle.owner(), signedOracleOwner_0);

    const DATA = 120;
    const TIMESTAMP = Math.floor(Date.now() / 1000);
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, signedOracleOwner_0);
    await signedOracle.update(DATA, TIMESTAMP, signature);

    const oracleInfo = await registry.getOracleInfo(newOracleAddr);
    const oracleList = await registry.getOracleList("signed:uint256");

    assert.equal(oracleList[0], newOracleAddr);
    assert.equal(oracleInfo[0], signedOracleOwner_0);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "Testing SignedOracle");
    assert.equal(parseInt(oracleInfo[3]), DATA);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP);

  });

  it('Create multiples oracles and register', async () => {

    let createTx_0 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 0",
      {
        value: web3.utils.toWei("1"),
        from: signedOracleOwner_0
      }
    );

    let createTx_1 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 1",
      {
        value: web3.utils.toWei("1"),
        from: signedOracleOwner_1
      }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    let signedOracle_0 = await SignedOracle.at(address_0)
    let signedOracle_1 = await SignedOracle.at(address_1)


    const DATA_0 = 100;
    const TIMESTAMP_0 = Math.floor(Date.now() / 1000);
    const message_0 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_0}, {type: 'uint256', value: TIMESTAMP_0});
    const signature_0 = await web3.eth.sign(message_0, signedOracleOwner_0);
    await signedOracle_0.update(DATA_0, TIMESTAMP_0, signature_0);

    const DATA_1 = 110;
    const TIMESTAMP_1 = Math.floor(Date.now() / 1000);
    const message_1 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_1}, {type: 'uint256', value: TIMESTAMP_1    });
    const signature_1 = await web3.eth.sign(message_1, signedOracleOwner_1);
    await signedOracle_1.update(DATA_1, TIMESTAMP_1, signature_1);

    let oracleInfo = await registry.getOracleInfo(address_0);
    let oracleList = await registry.getOracleList("signed:uint256");
    assert.equal(oracleList[0], address_0);
    assert.equal(oracleInfo[0], signedOracleOwner_0);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "SignedOracle 0");
    assert.equal(parseInt(oracleInfo[3]), DATA_0);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_0);

    oracleInfo = await registry.getOracleInfo(address_1);
    oracleList = await registry.getOracleList("signed:uint256");
    assert.equal(oracleList[1],address_1);
    assert.equal(oracleInfo[0], signedOracleOwner_1);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "SignedOracle 1");
    assert.equal(parseInt(oracleInfo[3]), DATA_1);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_1);


  });
})
