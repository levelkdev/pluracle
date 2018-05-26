
var help = require('./helpers.js');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

var SignedOracle = artifacts.require("SignedOracle.sol");

contract('SignedOracle', function(accounts) {

  it("Update price ticker", async function() {

  
  });


});
