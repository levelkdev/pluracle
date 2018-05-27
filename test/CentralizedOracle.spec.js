const CentralizedOracle = artifacts.require("CentralizedOracle.sol");
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract( 'CentralizedOracle', function ([owner, attacker]) {
  let centralizedOracle;
  const DATA_TYPE = 'unit256'

  beforeEach(async function () {
    centralizedOracle = await CentralizedOracle.new(DATA_TYPE);
  });

  it('Update with attacker. Expect Throw', async () => {
    centralizedOracle.update(120, {from: attacker})
      .should.be.rejectedWith(EVMRevert);
    expect(parseInt(await centralizedOracle.data())).to.eql(0);
  })
  it('Update with attacker. Expect ok', async () => {
    centralizedOracle.update(120);
    let data = await centralizedOracle.data()
    expect(parseInt(data)).to.eql(120);
  })
})
