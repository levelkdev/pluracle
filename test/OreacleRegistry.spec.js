
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const SignedOracleFactory = artifacts.require("SignedOracleFactory.sol");
const SimpleOracleFactory = artifacts.require("SimpleOracleFactory.sol");
const PluracleFactory = artifacts.require("PluracleFactory.sol");
const OracleRegistry = artifacts.require("OracleRegistry.sol");
const SignedOracle = artifacts.require("SignedOracle.sol");
const SimpleOracle = artifacts.require("SimpleOracle.sol");
const Pluracle = artifacts.require("Pluracle.sol");

contract('OracleRegistry and Factory', function ([registryOwner, factoryOwner, oracleOwner_0, oracleOwner_1, oracleOwner_2, oracleOwner_3]) {
  let signedOracle;
  let signature;
  let registry;

  const REWARD = 10
  const TIME_DELAY_ALLOWED = '3600' // 1 hour

  const DATA = 120;
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    registry = await OracleRegistry.new( { from: registryOwner });
    signedOracleFactory = await SignedOracleFactory.new(registry.address,{from: factoryOwner});
    simpleOracleFactory = await SimpleOracleFactory.new(registry.address,{from: factoryOwner});
    pluracleFactory = await PluracleFactory.new(registry.address,{from: factoryOwner});
    await registry.adminAddRole(signedOracleFactory.address, "factory");
    await registry.adminAddRole(simpleOracleFactory.address, "factory");
    await registry.adminAddRole(pluracleFactory.address, "factory");
  });

  it('Create an oracle and register it', async () => {
    const createTx = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "Testing SignedOracle",
      {value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    const newOracleAddr = createTx.logs[0].args.addr;
    const signedOracle = await SignedOracle.at(newOracleAddr);

    assert.equal(await signedOracle.owner(), oracleOwner_0);

    const DATA = 120;
    const TIMESTAMP = Math.floor(Date.now() / 1000);
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, oracleOwner_0);
    await signedOracle.update(DATA, TIMESTAMP, signature);

    const oracleInfo = await registry.getOracleInfo(newOracleAddr);
    const oracleList = await registry.getOracleList("signed:uint256");

    assert.equal(oracleList[0], newOracleAddr);
    assert.equal(oracleInfo[0], oracleOwner_0);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "Testing SignedOracle");
    assert.equal(parseInt(oracleInfo[3]), DATA);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP);

  });

  it('Create multiples oracles and register', async () => {

    let createTx_0 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );

    let createTx_1 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    let signedOracle_0 = await SignedOracle.at(address_0)
    let signedOracle_1 = await SignedOracle.at(address_1)


    const DATA_0 = 100;
    const TIMESTAMP_0 = Math.floor(Date.now() / 1000);
    const message_0 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_0}, {type: 'uint256', value: TIMESTAMP_0});
    const signature_0 = await web3.eth.sign(message_0, oracleOwner_0);
    await signedOracle_0.update(DATA_0, TIMESTAMP_0, signature_0);

    const DATA_1 = 110;
    const TIMESTAMP_1 = Math.floor(Date.now() / 1000);
    const message_1 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_1}, {type: 'uint256', value: TIMESTAMP_1    });
    const signature_1 = await web3.eth.sign(message_1, oracleOwner_1);
    await signedOracle_1.update(DATA_1, TIMESTAMP_1, signature_1);

    let oracleList = await registry.getOracleList("signed:uint256");
    let oracleInfo = await registry.getOracleInfo(oracleList[0]);
    assert.equal(oracleList[0], address_0);
    assert.equal(oracleInfo[0], oracleOwner_0);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "SignedOracle 0");
    assert.equal(parseInt(oracleInfo[3]), DATA_0);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_0);
    oracleInfo = await registry.getOracleInfo(oracleList[1]);
    assert.equal(oracleList[1],address_1);
    assert.equal(oracleInfo[0], oracleOwner_1);
    assert.equal(oracleInfo[1], "signed:uint256");
    assert.equal(oracleInfo[2], "SignedOracle 1");
    assert.equal(parseInt(oracleInfo[3]), DATA_1);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_1);

  });

  it('Create multiples SimpleOracles and register them', async () => {

    let createTx_0 = await simpleOracleFactory.create("SimpleOracle 0",
      { from: oracleOwner_0 }
    );

    let createTx_1 = await simpleOracleFactory.create("SimpleOracle 1",
      { from: oracleOwner_1 }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    let simpleOracle_0 = await SimpleOracle.at(address_0)
    let simpleOracle_1 = await SimpleOracle.at(address_1)


    const DATA_0 = 100;
    const TIMESTAMP_0 = Math.floor(Date.now() / 1000);
    await simpleOracle_0.update(DATA_0, { from: oracleOwner_0 } );

    const DATA_1 = 110;
    const TIMESTAMP_1 = Math.floor(Date.now() / 1000);
    await simpleOracle_1.update(DATA_1, { from: oracleOwner_1 });

    let oracleList = await registry.getOracleList("simple:uint256");
    let oracleInfo = await registry.getOracleInfo(oracleList[0]);
    assert.equal(oracleList[0], address_0);
    assert.equal(oracleInfo[0], oracleOwner_0);
    assert.equal(oracleInfo[1], "simple:uint256");
    assert.equal(oracleInfo[2], "SimpleOracle 0");
    assert.equal(parseInt(oracleInfo[3]), DATA_0);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_0);
    oracleInfo = await registry.getOracleInfo(oracleList[1]);
    assert.equal(oracleList[1],address_1);
    assert.equal(oracleInfo[0], oracleOwner_1);
    assert.equal(oracleInfo[1], "simple:uint256");
    assert.equal(oracleInfo[2], "SimpleOracle 1");
    assert.equal(parseInt(oracleInfo[3]), DATA_1);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_1);

  });

  it('Create puracle of signed oracles', async () => {

    let createTx_0 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    let createTx_1 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    let createTx_2 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 2",
      { value: web3.utils.toWei("1"), from: oracleOwner_2 }
    );
    let createTx_3 = await pluracleFactory.create(
      REWARD, 0, "Signed Pluracle",
      { value: web3.utils.toWei("1"), from: oracleOwner_3 }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    const address_2 =createTx_2.logs[0].args.addr
    const address_3 =createTx_3.logs[0].args.addr
    let signedOracle_0 = await SignedOracle.at(address_0)
    let signedOracle_1 = await SignedOracle.at(address_1)
    let signedOracle_2 = await SignedOracle.at(address_2)
    let pluracle_0 = await Pluracle.at(address_3)
    await pluracle_0.addOracle(signedOracle_0.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(signedOracle_1.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(signedOracle_2.address, {from: oracleOwner_3});

    const DATA_0 = 20;
    const TIMESTAMP_0 = Math.floor(Date.now() / 1000);
    const message_0 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_0}, {type: 'uint256', value: TIMESTAMP_0});
    const signature_0 = await web3.eth.sign(message_0, oracleOwner_0);
    await signedOracle_0.update(DATA_0, TIMESTAMP_0, signature_0);
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 20);

    const DATA_1 = 80;
    const TIMESTAMP_1 = Math.floor(Date.now() / 1000);
    const message_1 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_1}, {type: 'uint256', value: TIMESTAMP_1});
    const signature_1 = await web3.eth.sign(message_1, oracleOwner_1);
    await signedOracle_1.update(DATA_1, TIMESTAMP_1, signature_1);
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 50);

    const DATA_2 = 20;
    const TIMESTAMP_2 = Math.floor(Date.now() / 1000);
    const message_2 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_2}, {type: 'uint256', value: TIMESTAMP_2});
    const signature_2 = await web3.eth.sign(message_2, oracleOwner_2);
    await signedOracle_2.update(DATA_2, TIMESTAMP_2, signature_2);
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 40);

    let oracleList = await registry.getOracleList("pluracle:uint256");
    let oracleInfo = await registry.getOracleInfo(oracleList[0]);
    assert.equal(oracleList[0], address_3);
    assert.equal(oracleInfo[0], oracleOwner_3);
    assert.equal(oracleInfo[1], "pluracle:uint256");
    assert.equal(oracleInfo[2], "Signed Pluracle");
    assert.equal(parseInt(oracleInfo[3]), 40);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_2);

  });

  it('Create puracle of simple oracles', async () => {

    let createTx_0 = await simpleOracleFactory.create("simpleOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    let createTx_1 = await simpleOracleFactory.create("simpleOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    let createTx_2 = await simpleOracleFactory.create("simpleOracle 2",
      { value: web3.utils.toWei("1"), from: oracleOwner_2 }
    );
    let createTx_3 = await pluracleFactory.create(
      REWARD, 0, "Simple Pluracle",
      { value: web3.utils.toWei("1"), from: oracleOwner_3 }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    const address_2 =createTx_2.logs[0].args.addr
    const address_3 =createTx_3.logs[0].args.addr
    let simpleOracle_0 = await SimpleOracle.at(address_0)
    let simpleOracle_1 = await SimpleOracle.at(address_1)
    let simpleOracle_2 = await SimpleOracle.at(address_2)
    let pluracle_0 = await Pluracle.at(address_3)

    await pluracle_0.addOracle(simpleOracle_0.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(simpleOracle_1.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(simpleOracle_2.address, {from: oracleOwner_3});

    const DATA_0 = 20;
    await simpleOracle_0.update(DATA_0, {from: oracleOwner_0});
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 20);

    const DATA_1 = 80;
    await simpleOracle_1.update(DATA_1, {from: oracleOwner_1});
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 50);

    const DATA_2 = 20;
    const TIMESTAMP = Math.floor(Date.now() / 1000);
    await simpleOracle_2.update(DATA_2, {from: oracleOwner_2});
    await pluracle_0.update();

    assert.equal(parseInt(await pluracle_0.data()), 40);

    let oracleList = await registry.getOracleList("pluracle:uint256");
    let oracleInfo = await registry.getOracleInfo(oracleList[0]);
    assert.equal(oracleList[0], address_3);
    assert.equal(oracleInfo[0], oracleOwner_3);
    assert.equal(oracleInfo[1], "pluracle:uint256");
    assert.equal(oracleInfo[2], "Simple Pluracle");
    assert.equal(parseInt(oracleInfo[3]), 40);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP);

  });

  it('Create puracle of pluracles ¯\_(ツ)_/¯ ', async () => {
    // SIMPLE ORACLE
    let createTx_0 = await simpleOracleFactory.create("simpleOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    let createTx_1 = await simpleOracleFactory.create("simpleOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    let createTx_2 = await simpleOracleFactory.create("simpleOracle 2",
      { value: web3.utils.toWei("1"), from: oracleOwner_2 }
    );
    let createTx_3 = await pluracleFactory.create(
      REWARD, 0, "Simple Pluracle",
      { value: web3.utils.toWei("1"), from: oracleOwner_3 }
    );
    const address_0 =createTx_0.logs[0].args.addr
    const address_1 =createTx_1.logs[0].args.addr
    const address_2 =createTx_2.logs[0].args.addr
    const address_3 =createTx_3.logs[0].args.addr
    let simpleOracle_0 = await SimpleOracle.at(address_0)
    let simpleOracle_1 = await SimpleOracle.at(address_1)
    let simpleOracle_2 = await SimpleOracle.at(address_2)
    let pluracle_0 = await Pluracle.at(address_3)

    await pluracle_0.addOracle(simpleOracle_0.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(simpleOracle_1.address, {from: oracleOwner_3});
    await pluracle_0.addOracle(simpleOracle_2.address, {from: oracleOwner_3});

    const DATA_0 = 20;
    await simpleOracle_0.update(DATA_0, {from: oracleOwner_0});
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 20);

    const DATA_1 = 80;
    await simpleOracle_1.update(DATA_1, {from: oracleOwner_1});
    await pluracle_0.update();
    assert.equal(parseInt(await pluracle_0.data()), 50);

    const DATA_2 = 20;
    const TIMESTAMP = Math.floor(Date.now() / 1000);
    await simpleOracle_2.update(DATA_2, {from: oracleOwner_2});
    await pluracle_0.update();

    assert.equal(parseInt(await pluracle_0.data()), 40);

    let oracleList = await registry.getOracleList("pluracle:uint256");
    let oracleInfo = await registry.getOracleInfo(oracleList[0]);
    assert.equal(oracleList[0], address_3);
    assert.equal(oracleInfo[0], oracleOwner_3);
    assert.equal(oracleInfo[1], "pluracle:uint256");
    assert.equal(oracleInfo[2], "Simple Pluracle");
    assert.equal(parseInt(oracleInfo[3]), 40);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP);
    //END OF SIMPLE ORACLE

    // SIGNED ORACLE
    let createTx_10 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    let createTx_11 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    let createTx_12 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 2",
      { value: web3.utils.toWei("1"), from: oracleOwner_2 }
    );
    let createTx_13 = await pluracleFactory.create(
      REWARD, 0, "Signed Pluracle",
      { value: web3.utils.toWei("1"), from: oracleOwner_3 }
    );
    const address_10 =createTx_10.logs[0].args.addr
    const address_11 =createTx_11.logs[0].args.addr
    const address_12 =createTx_12.logs[0].args.addr
    const address_13 =createTx_13.logs[0].args.addr
    let signedOracle_10 = await SignedOracle.at(address_10)
    let signedOracle_11 = await SignedOracle.at(address_11)
    let signedOracle_12 = await SignedOracle.at(address_12)
    let pluracle_10 = await Pluracle.at(address_13)
    await pluracle_10.addOracle(signedOracle_10.address, {from: oracleOwner_3});
    await pluracle_10.addOracle(signedOracle_11.address, {from: oracleOwner_3});
    await pluracle_10.addOracle(signedOracle_12.address, {from: oracleOwner_3});

    const DATA_10 = 20;
    const TIMESTAMP_10 = Math.floor(Date.now() / 1000);
    const message_10 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_10}, {type: 'uint256', value: TIMESTAMP_10});
    const signature_10 = await web3.eth.sign(message_10, oracleOwner_0);
    await signedOracle_10.update(DATA_10, TIMESTAMP_10, signature_10);
    await pluracle_10.update();
    assert.equal(parseInt(await pluracle_10.data()), 20);

    const DATA_11 = 80;
    const TIMESTAMP_11 = Math.floor(Date.now() / 1000);
    const message_11 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_11}, {type: 'uint256', value: TIMESTAMP_11});
    const signature_11 = await web3.eth.sign(message_11, oracleOwner_1);
    await signedOracle_11.update(DATA_11, TIMESTAMP_11, signature_11);
    await pluracle_10.update();
    assert.equal(parseInt(await pluracle_10.data()), 50);
    const DATA_12 = 20;
    const TIMESTAMP_12 = Math.floor(Date.now() / 1000);
    const message_12 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_12}, {type: 'uint256', value: TIMESTAMP_12});
    const signature_12 = await web3.eth.sign(message_12, oracleOwner_2);
    await signedOracle_12.update(DATA_12, TIMESTAMP_12, signature_12);
    await pluracle_10.update();
    assert.equal(parseInt(await pluracle_10.data()), 40);

    oracleList = await registry.getOracleList("pluracle:uint256");
    oracleInfo = await registry.getOracleInfo(oracleList[1]);
    assert.equal(oracleList[1], address_13);
    assert.equal(oracleInfo[0], oracleOwner_3);
    assert.equal(oracleInfo[1], "pluracle:uint256");
    assert.equal(oracleInfo[2], "Signed Pluracle");
    assert.equal(parseInt(oracleInfo[3]), 40);
    assert.equal(parseInt(oracleInfo[4]), TIMESTAMP_12);
    // END OF SIGNED ORACLE

    // PLURACLE OF PLURACLES!
    let createTx_PluracleOfPluracles = await pluracleFactory.create(
      REWARD, 0, "Pluracle of Pluracles",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );

    const address_PluracleOfPluracles = createTx_PluracleOfPluracles.logs[0].args.addr;
    let pluracleOfPluracles = await Pluracle.at(address_PluracleOfPluracles)
    await pluracleOfPluracles.addOracle(pluracle_0.address, {from: oracleOwner_1});
    await pluracleOfPluracles.addOracle(pluracle_10.address, {from: oracleOwner_1});


    await pluracleOfPluracles.update();
    const TIMESTAMP_PLURACLE = Math.floor(Date.now() / 1000);
    assert.equal(parseInt(await pluracleOfPluracles.data()), 40);

    oracleList = await registry.getOracleList("pluracle:uint256");
    oracleInfo = await registry.getOracleInfo(oracleList[2]);
    assert.equal(oracleList[2], address_PluracleOfPluracles);
    assert.equal(oracleInfo[0], oracleOwner_1);
    assert.equal(oracleInfo[1], "pluracle:uint256");
    assert.equal(oracleInfo[2], "Pluracle of Pluracles");
    assert.equal(parseInt(oracleInfo[3]), 40);
    expect(parseInt(oracleInfo[4])).closeTo(TIMESTAMP_PLURACLE, 2); // because of my slow pc
    // END OF PLURACLE OF PLURACLES!
  })
  it('Create a Mixed puracle t(ツt) ', async () => {
    let createTx_0 = await simpleOracleFactory.create("simpleOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_0 }
    );
    let createTx_1 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 0",
      { value: web3.utils.toWei("1"), from: oracleOwner_1 }
    );
    let createTx_2 = await signedOracleFactory.create(
      REWARD, TIME_DELAY_ALLOWED, "SignedOracle 1",
      { value: web3.utils.toWei("1"), from: oracleOwner_2 }
    );
    let createTx_3 = await pluracleFactory.create(
      REWARD, 0, "Mixed Pluracle",
      { value: web3.utils.toWei("1"), from: oracleOwner_3 }
    );


  const address_0 = createTx_0.logs[0].args.addr
  const address_1 = createTx_1.logs[0].args.addr
  const address_2 = createTx_2.logs[0].args.addr
  const address_3 = createTx_3.logs[0].args.addr

  let simpleOracle = await SimpleOracle.at(address_0)
  let signedOracle_0 = await SignedOracle.at(address_1)
  let signedOracle_1 = await SignedOracle.at(address_2)
  let pluracle = await Pluracle.at(address_3)

  await pluracle.addOracle(signedOracle_0.address, {from: oracleOwner_3});
  await pluracle.addOracle(simpleOracle.address, {from: oracleOwner_3});

  const DATA_0 = 20;
  await simpleOracle.update(DATA_0, {from: oracleOwner_0});
  await pluracle.update();
  assert.equal(parseInt(await pluracle.data()), 20);

  const DATA_11 = 80;
  const TIMESTAMP_11 = Math.floor(Date.now() / 1000);
  const message_11 = await web3.utils.soliditySha3({type: 'uint256', value: DATA_11}, {type: 'uint256', value: TIMESTAMP_11});
  const signature_11 = await web3.eth.sign(message_11, oracleOwner_1);
  await signedOracle_0.update(DATA_11, TIMESTAMP_11, signature_11);
  await pluracle.update();
  assert.equal(parseInt(await pluracle.data()), 50);
  let TIMESTAMP_PLURACLE = Math.floor(Date.now() / 1000);

  let oracleList = await registry.getOracleList("pluracle:uint256");
  let oracleInfo = await registry.getOracleInfo(oracleList[0]);
  assert.equal(oracleList[0], address_3);
  assert.equal(oracleInfo[0], oracleOwner_3);
  assert.equal(oracleInfo[1], "pluracle:uint256");
  assert.equal(oracleInfo[2], "Mixed Pluracle");
  assert.equal(parseInt(oracleInfo[3]), 50);
  expect(parseInt(oracleInfo[4])).closeTo(TIMESTAMP_PLURACLE, 2); // because of my slow pc

  await pluracle.addOracle(signedOracle_1.address, {from: oracleOwner_3});
  const DATA = 20;
  const TIMESTAMP = Math.floor(Date.now() / 1000);
  const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
  const signature = await web3.eth.sign(message, oracleOwner_2);
  await signedOracle_1.update(DATA, TIMESTAMP, signature);
  await pluracle.update();
  assert.equal(parseInt(await pluracle.data()), 40);
  TIMESTAMP_PLURACLE = Math.floor(Date.now() / 1000);

  oracleList = await registry.getOracleList("pluracle:uint256");
  oracleInfo = await registry.getOracleInfo(oracleList[0]);
  assert.equal(oracleList[0], address_3);
  assert.equal(oracleInfo[0], oracleOwner_3);
  assert.equal(oracleInfo[1], "pluracle:uint256");
  assert.equal(oracleInfo[2], "Mixed Pluracle");
  assert.equal(parseInt(oracleInfo[3]), 40);
  expect(parseInt(oracleInfo[4])).closeTo(TIMESTAMP_PLURACLE, 2); // because of my slow pc


  })
})
