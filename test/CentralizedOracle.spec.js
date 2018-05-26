const CentralizedOracle = artifacts.require("CentralizedOracle.sol");
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'

contract.only( 'CentralizedOracle', function ([owner, attacker]) {
  let centralizedOracle;
  const DATA_TYPE = 'unit'
  const DATA = '0x7800000000000000000000000000000000000000000000000000000000000000';

  beforeEach(async function () {
    centralizedOracle = await CentralizedOracle.new(DATA_TYPE);
  });

  it('Update with attacker. Expect Throw', async () => {
    centralizedOracle.update(DATA, {from: attacker})
      .should.be.rejectedWith(EVMRevert);
    expect(await centralizedOracle.data()).to.eql(ZERO);
  })
  it('Update with attacker. Expect ok', async () => {
    centralizedOracle.update(DATA);
    let data = await stringify(centralizedOracle.data())
    expect(data).to.eql(DATA);
  })
})

const stringify = async (value) => {
  value = await value
  return value.toString()
}