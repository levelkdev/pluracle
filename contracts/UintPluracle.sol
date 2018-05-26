pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./OracleCasting.sol";
import "./interfaces/ISignedOracle.sol";


/**
 * @title UintPluracle
 * @dev An oracle of uint256 types oracles that provides a medium price.
 */
contract UintPluracle is Ownable {
  using SafeMath for uint256;

  ISignedOracle[] oracles;
  uint256 public _data;
  uint256 public _reward;
  uint256 public _lastTimestamp;
  uint256 public _maximumUpdateFrequency;
  uint256 public _pluracleDataType;

  function UintPluracle(
    uint256 reward
  ) payable {
    _reward = reward;
    _pluracleDataType = "uint256";
  }

  function update(bytes32 data, uint256 dataTimestamp, bytes signature) public {
    // Check that time has passed since last update
    require((now - _lastTimestamp) > _maximumUpdateFrequency );

    // Get all prices
    uint256 totalPrice;
    uint256 totalOracles;
    for(uint8 i = 0; i < oracles.length; i ++) {
      if (oracles[i] != address(0)) {
        totalPrice = totalPrice.add(OracleCasting.bytesToUint(oracles[i].data()));
        totalOracles = totalOracles.add(1);
      }
    }

    // Update the oracle data
    _data = totalPrice.div(totalOracles);
    _lastTimestamp = now;

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(_reward);
  }

  function edit(uint256 reward) onlyOwner {
    _reward = reward;
  }

  function addOracle(address newOracle) onlyOwner {
    require(newOracle.dataType == _pluracleDataType)
    oracles.push(ISignedOracle(newOracle));
  }

  function removeOracle(uint256 oracleIndex) onlyOwner {
    delete oracles[oracleIndex];
  }

  function setMaximumUpdateFrequency(uint256 newMaximumUpdateFrequency) onlyOwner {
    _maximumUpdateFrequency = newUpdateFrequency
  }

  function dataType() public view returns (string) {
    return "uint256";
  }

  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  function data() public view returns (uint256) {
    return _data;
  }

  function reward() public view returns (uint256) {
    return _reward;
  }

  function() payable {}

}
