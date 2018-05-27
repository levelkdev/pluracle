const SimpleOracle = artifacts.require("SimpleOracle.sol");
const EVMRevert = require('./helpers/EVMRevert');
require('chai')
  .use(require('chai-as-promised'))
  .should();
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract( 'SimpleOracle', function ([owner, attacker]) {
  let simpleOracle;
  const DATA_TYPE = 'unit256'

  beforeEach(async function () {
    simpleOracle = await SimpleOracle.new(DATA_TYPE);
  });

  it('Update with attacker. Expect Throw', async () => {
    simpleOracle.update(120, {from: attacker})
      .should.be.rejectedWith(EVMRevert);
    expect(parseInt(await simpleOracle.data())).to.eql(0);
  })
  it('Update with attacker. Expect ok', async () => {
    simpleOracle.update(120);
    let data = await simpleOracle.data()
    expect(parseInt(data)).to.eql(120);
  })
})
