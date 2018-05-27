
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const SignedOracleV1 = artifacts.require("SignedOracleV1.sol");
const SignedOracleV2 = artifacts.require("SignedOracleV2.sol");
const AdminUpgradeabilityProxy = artifacts.require('AdminUpgradeabilityProxy');

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract('SignedOracleProxy', function ([owner, user, attacker]) {
  let signedOracle;
  let proxy;
  let signature;

  const REWARD = web3.utils.toWei('0.01', 'ether')
  const TIME_DELAY_ALLOWED = '3600' // 1 hour

  const DATA = 120;
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  it('Update, upgrade proxy and preserve storage', async () => {

    signedOracleV1 = await SignedOracleV1.new({from: owner});

    console.log('Deploying a proxy pointing to that implementation...');
    const proxy = await AdminUpgradeabilityProxy.new(signedOracleV1.address, {from: owner});

    console.log('Calling initialize on proxy...');
    let signedOracleProxy = await SignedOracleV1.at(proxy.address);
    await signedOracleProxy.initialize(owner, REWARD, TIME_DELAY_ALLOWED, {value: web3.utils.toWei('3'), from: user});
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, owner);

    const result = await signedOracleProxy.update(DATA, TIMESTAMP, signature, {from: user});
    expect(parseInt(await signedOracleProxy.data({from: user}))).to.eql(120); //default value

    try {
      await signedOracleProxy.decimals({ from: user });
      assert(false, 'decimals shouldnt work');
    } catch (e) {
      if ((e.message.search('invalid opcode') >= 0) || (e.message.search('revert') >= 0))
        throw e;
    }

    signedOracleV2 = await SignedOracleV2.new({from: owner});
    const initializeData = signedOracleV2.contract.initialize.getData(6);
    await proxy.upgradeToAndCall(signedOracleV2.address, initializeData, {from: owner});
    signedOracleProxy = await SignedOracleV2.at(proxy.address);

    expect(parseInt(await signedOracleProxy.data({from: user}))).to.eql(120); //default value
    expect(parseInt(await signedOracleProxy.decimals({from: user}))).to.eql(6); //default value

  })

})
