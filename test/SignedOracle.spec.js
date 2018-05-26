const SignedOracle = artifacts.require("SignedOracle.sol");
const { hashMessage, signMessage} = require('./helpers/sign')
const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545');

const signedMessageProvider = (data, timestamp, privateKey) => {
  const message = web3.utils.sha3(
    web3.utils.toHex(data),
    web3.utils.toHex(timestamp),
  {});
  const {signature} = web3.eth.accounts.sign(message, privateKey);

  return signature;
}

contract( 'SignedOracle', function (accounts) {
  let signedOracle;
  let signer = accounts[0];
  const REWARD = web3.utils.toWei('1', 'ether')
  const TIME_DELAY_ALLOWED =web3.utils.toBN(3600); // 1 hour
  const DATA_TYPE = 'int';

  const DATA = '120';
  const TIMESTAMP = Math.floor(Date.now() / 1000);
  const SIGNATURE = signedMessageProvider(DATA, TIMESTAMP, '0x757c30ed2a4b975007e96dd44f7e1b399cd7261c4f44e0aa3b5c0dc06bf871ae')

  const BAD_DATA = '2';
  const BAD_TIMESTAMP = TIMESTAMP - 5000;

  beforeEach(async function () {
    signedOracle = await SignedOracle.new(REWARD, TIME_DELAY_ALLOWED, DATA_TYPE);
    await web3.eth.sendTransaction({
      to:signedOracle.addres,
      from: accounts[1],
      value: web3.utils.toWei('3', 'ether')
    });
  });

  it('Update with old timestamp. Expect Throw')

  it('Update with altered data. Expect Throw')
  it('Update with altered signature. Expect Throw')
  it('Update. Expect ok', async () => {
    // function update(bytes data, uint256 dataTimestamp, bytes signature) public {
    try {
      console.log(DATA, TIMESTAMP, SIGNATURE);

      console.log('_timeDelayAllowed', await signedOracle._timeDelayAllowed());

      const result = await signedOracle.update(DATA, TIMESTAMP, SIGNATURE)
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  })
  it('Update. Expect throw for no funds')
  it('Update. Expect funds to be transfered')

})
