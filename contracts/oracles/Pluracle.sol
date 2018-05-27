pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/ISignedOracle.sol";


/**
 * @title Pluracle
 * @dev An oracle of uint256 types oracles that provides a medium price.
 */
contract Pluracle is Ownable {
  using SafeMath for uint256;

  ISignedOracle[] public _oracles;
  uint256 public _data;
  uint256 public _reward;
  uint256 public _lastTimestamp;
  uint256 public _maximumUpdateFrequency;
  string public _pluracleDataType;

  function Pluracle(
    uint256 reward,
    uint256 maximumUpdateFrequency
  ) payable {
    _reward = reward;
    _maximumUpdateFrequency = maximumUpdateFrequency;
    _pluracleDataType = "uint256";
  }

  function update() public {
    // Check that time has passed since last update
    require((now - _lastTimestamp) >= _maximumUpdateFrequency );

    // Get all prices
    uint256 totalPrice;
    uint256 totalOracles;
    for(uint8 i = 0; i < _oracles.length; i ++) {
      if ((_oracles[i] != address(0)) && (_oracles[i].lastTimestamp() > 0)) {
        totalPrice = totalPrice.add(_oracles[i].data());
        totalOracles = totalOracles.add(1);
      }
    }

    // Update the oracle data
    _data = totalPrice.div(totalOracles);
    _lastTimestamp = now;

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(_reward);
  }

  function edit(uint256 reward) onlyOwner public {
    _reward = reward;
  }

  function addOracle(address newOracle) onlyOwner public {
    bytes32 newOracleTypeHash = keccak256(ISignedOracle(newOracle).dataType());
    require(newOracleTypeHash == keccak256(_pluracleDataType));
    _oracles.push(ISignedOracle(newOracle));
  }

  function removeOracle(uint256 oracleIndex) onlyOwner public {
    delete _oracles[oracleIndex];
  }

  function setMaximumUpdateFrequency(uint256 newUpdateFrequency) onlyOwner public {
    _maximumUpdateFrequency = newUpdateFrequency;
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

  function oracles() public view returns (ISignedOracle[]) {
    return _oracles;
  }

  function() payable {}

}
