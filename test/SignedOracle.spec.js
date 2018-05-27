const SignedOracle = artifacts.require("SignedOracle.sol");
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract('SignedOracle', function ([owner, user, attacker]) {
  let signedOracle;
  let signature;

  const REWARD = web3.utils.toWei('0.01', 'ether')
  const TIME_DELAY_ALLOWED = '3600' // 1 hour

  const DATA = 120;
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    signedOracle = await SignedOracle.new(
      REWARD, TIME_DELAY_ALLOWED,
      {from: owner, value: web3.utils.toWei('3')});
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, owner);
  });

  it('Update with old timestamp. Expect Throw', async () => {
    const BAD_TIMESTAMP = TIMESTAMP - 4000;
    signedOracle.update(DATA, BAD_TIMESTAMP, signature).should.be.rejectedWith(EVMRevert);
    expect(parseInt(await signedOracle.data())).to.eql(0); //default value
    }
  )

  it('Update with altered data. Expect Throw', async () => {
    const BADdata = web3.utils.toHex(100);
    signedOracle.update(BADdata, TIMESTAMP, signature).should.be.rejectedWith(EVMRevert);
    expect(parseInt(await signedOracle.data())).to.eql(0); //default value
  })
  it('Update with altered signature. Expect Throw', async () => {
    const message = await web3.utils.soliditySha3({type: 'uint256', value: DATA}, {type: 'uint256', value: TIMESTAMP});
    signature = await web3.eth.sign(message, attacker);

    signedOracle.update(DATA, TIMESTAMP, signature).should.be.rejectedWith(EVMRevert);
    expect(parseInt(await signedOracle.data())).to.eql(0); //default value

  })
  it('Update. Expect ok', async () => {
    const result = await signedOracle.update(DATA, TIMESTAMP, signature);
    const oracleData = await signedOracle.data();
    expect(parseInt(await signedOracle.data())).to.eql(120); //default value
  })

  it('Update. Expect throw for no funds', async () => {
    // Deploy signed oracle with no funds
    signedOracle = await SignedOracle.new(
      REWARD,
      TIME_DELAY_ALLOWED,
      { from: owner}
    );
    signedOracle.update(DATA, TIMESTAMP, signature).should.be.rejectedWith(EVMRevert);
    expect(parseInt(await signedOracle.data())).to.eql(0); //default value
  })

  it('Update. Expect funds to be transfered', async () => {
    const userBalance = await web3.eth.getBalance(user);
    const result = await signedOracle.update(DATA, TIMESTAMP, signature, {
      from: user
    });
    expect(await web3.eth.getBalance(user)).gt(userBalance);
  })

  it('Edit. Expect ok', async () => {
    const NEW_REWARD =  web3.utils.toWei('0.1', 'ether');
    const NEW_TIME_ALLOWED = '5000';
    const result = await signedOracle.edit(NEW_REWARD, NEW_TIME_ALLOWED, {from: owner});

    reward = await stringify(signedOracle.reward())
    expect(reward).to.eql(NEW_REWARD);

    timeAllowed = await stringify(signedOracle.timeDelayAllowed())
    expect(timeAllowed).to.eql(NEW_TIME_ALLOWED);
  })

  it('Edit with attacker. Expect throw', async () => {
    const NEW_REWARD =  web3.utils.toWei('0.1', 'ether');
    const NEW_TIME_ALLOWED = 5000;
    const result = await signedOracle.edit(NEW_REWARD, NEW_TIME_ALLOWED,
       {from: attacker}).should.be.rejectedWith(EVMRevert);

    reward = await stringify(signedOracle.reward())
    expect(reward).to.eql(REWARD);

    timeAllowed = await stringify(signedOracle.timeDelayAllowed())
    expect(timeAllowed).to.eql(TIME_DELAY_ALLOWED);
  })
})

const stringify = async (value) => {
  value = await value
  return value.toString()
}
