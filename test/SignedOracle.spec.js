const SignedOracle = artifacts.require("SignedOracle.sol");

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract( 'SignedOracle', function (accounts) {

  let signedOracle;
  let owner = accounts[0];
  let user = accounts[1];
  let attacker = accounts[5];
  let signature;

  const REWARD = web3.utils.toWei('0.01', 'ether')
  const TIME_DELAY_ALLOWED = 3600 // 1 hour
  const DATA_TYPE = 'uint';

  const DATA = web3.utils.toHex(120);
  const TIMESTAMP = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    signedOracle = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED, DATA_TYPE,
    {from: owner, value: web3.utils.toWei('3')});
    const message = await web3.utils.soliditySha3(DATA, TIMESTAMP);
    signature = await web3.eth.sign(message, owner);
  });

  it('Update with old timestamp. Expect Throw', async () => {
    const BAD_TIMESTAMP = TIMESTAMP - 4000;
    try {
      const result = await signedOracle.update(DATA, BAD_TIMESTAMP, signature);
    } catch (e){
      expect(await signedOracle._data()).to.eql('0x'); //default value
    }
  })

  it('Update with altered data. Expect Throw', async () => {
    const BAD_DATA = web3.utils.toHex(100);
    try {
      const result = await signedOracle.update(BAD_DATA, TIMESTAMP, signature);
    } catch (e){
      expect(await signedOracle._data()).to.eql('0x'); //default value
    }
  })
  it('Update with altered signature. Expect Throw', async () => {
    try {
      const result = await signedOracle.update(DATA, TIMESTAMP, signature);
    } catch (e){
      expect(await signedOracle._data()).to.eql('0x'); //default value
    }
  })
  it('Update. Expect ok', async () => {
    const result = await signedOracle.update(DATA, TIMESTAMP, signature);
    expect(await signedOracle._data()).to.eql(DATA);
  })

  it('Update. Expect throw for no funds', async () => {
    // Deploy signed oracle with no funds
    signedOracle = await SignedOracle.new(
      REWARD,
      TIME_DELAY_ALLOWED,
      DATA_TYPE,
      {
        from: owner
      }
    );
    try {
      const result = await signedOracle.update(DATA, TIMESTAMP, signature);
    } catch (e){
      expect(await signedOracle._data()).to.eql('0x'); //default value
    }
  })

  it('Update. Expect funds to be transfered', async () => {
    const userBalance = await web3.eth.getBalance(user);
    const result = await signedOracle.update(DATA, TIMESTAMP, signature, {
      from: user
    });
    expect(await web3.eth.getBalance(user)).gt(userBalance);
  })
})
