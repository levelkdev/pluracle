const SignedOracle = artifacts.require("SignedOracle.sol");
const UintPluracle = artifacts.require("UintPluracle.sol");
const OracleCasting = artifacts.require("OracleCasting.sol");

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
var BN = web3.utils.BN;

contract( 'SignedOracle', function ([owner, user, attacker]) {
  let signedOracle1, signedOracle2, signedOracle3, uintPluracle;
  let signature;

  const REWARD = 100;
  const TIME_DELAY_ALLOWED = 300 // 5 minutes

  const DATA = web3.utils.numberToHex(120);
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    signedOracle1 = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED,
      {from: owner, value: 1000000}
    );
    signedOracle2 = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED,
      {from: owner, value: 1000000}
    );
    signedOracle3 = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED,
      {from: owner, value: 1000000}
    );
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, owner);

    const oracleCasting = await OracleCasting.new();
    UintPluracle.link('OracleCasting', oracleCasting.address);
    uintPluracle = await UintPluracle.new(REWARD, 0, {from: owner, value: 1000000});
  });

  it('Add uint256 oracles in uintPluracle', async () => {
    await uintPluracle.addOracle(signedOracle1.address);
    await uintPluracle.addOracle(signedOracle2.address);
    await uintPluracle.addOracle(signedOracle3.address);
  });

  it('remove an oracle in uintPluracle', async () => {
    signedOracle4 = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED,
      {from: owner, value: 1000000}
    );
    await uintPluracle.addOracle(signedOracle1.address);
    await uintPluracle.addOracle(signedOracle2.address);
    await uintPluracle.addOracle(signedOracle3.address);
    await uintPluracle.addOracle(signedOracle4.address);
    await uintPluracle.removeOracle(3);
    let oracles =  await uintPluracle.oracles();
    assert.equal(signedOracle1.address, oracles[0]);
    assert.equal(signedOracle2.address, oracles[1]);
    assert.equal(signedOracle3.address, oracles[2]);
    assert.equal('0x0000000000000000000000000000000000000000', oracles[3]);
    await uintPluracle.removeOracle(1);
    oracles =  await uintPluracle.oracles();
    assert.equal('0x0000000000000000000000000000000000000000', oracles[1]);
  });

  it('update pluracle and get right value', async () => {
    await uintPluracle.addOracle(signedOracle1.address);
    await uintPluracle.addOracle(signedOracle2.address);
    await uintPluracle.addOracle(signedOracle3.address);

    let timestamp = Math.floor(Date.now() / 1000);
    let message = await web3.utils.soliditySha3(
      {type: 'uint256', value: web3.utils.numberToHex(50)},
      {type: 'uint256', value: timestamp}
    );
    let signature = await web3.eth.sign(message, owner);
    await signedOracle1.update(web3.utils.numberToHex(50), timestamp, signature);

    message = await web3.utils.soliditySha3(
      {type: 'uint256', value: web3.utils.numberToHex(95)},
      {type: 'uint256', value: timestamp}
    );
    signature = await web3.eth.sign(message, owner);
    await signedOracle2.update(web3.utils.numberToHex(95), timestamp, signature);

    message = await web3.utils.soliditySha3(
      {type: 'uint256', value: web3.utils.numberToHex(5)},
      {type: 'uint256', value: timestamp}
    );
    signature = await web3.eth.sign(message, owner);
    await signedOracle3.update(web3.utils.numberToHex(5), timestamp, signature);

    await uintPluracle.update();

    expect(parseInt(await uintPluracle.data())).to.eql(50);
  });

});
