const SignedOracle = artifacts.require("SignedOracle.sol");

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract( 'SignedOracle', function (accounts) {

  let signedOracle;
  let signer = accounts[0];
  const REWARD = web3.utils.toWei('1', 'ether')
  const TIME_DELAY_ALLOWED = 3600 // 1 hour
  const DATA_TYPE = 'uint';

  beforeEach(async function () {
    signedOracle = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED, DATA_TYPE,
    {from: accounts[0], value: web3.utils.toWei('3')});
  });

  it('Update with old timestamp. Expect Throw')

  it('Update with altered data. Expect Throw')
  it('Update with altered signature. Expect Throw')
  it('Update. Expect ok', async () => {
      const DATA = web3.utils.toHex(120);
      const TIMESTAMP = Math.floor(Date.now() / 1000);
      const MESSAGE = await web3.utils.soliditySha3(DATA, TIMESTAMP);

      const signature = await web3.eth.sign(MESSAGE, accounts[0]);

      const result = await signedOracle.update(DATA, TIMESTAMP, signature);
  })
  it('Update. Expect throw for no funds')
  it('Update. Expect funds to be transfered')

})
