pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/IDataFeedOracle.sol";


/**
 * @title Pluracle
 * @dev An oracle of uint256 types oracles that provides a medium price.
 */
contract Pluracle is IDataFeedOracle, Ownable {
  using SafeMath for uint256;

  IDataFeedOracle[] public _oracles;
  uint256 public _data;
  uint256 public _reward;
  uint256 public _lastTimestamp;
  uint256 public _maxUpdateFrequency;
  string public _pluracleDataType;

  /// @dev Constructor
  /// @param reward bytes32 the wei reward per update
  /// @param maxUpdateFrequency new max update frequency
  function Pluracle(
    uint256 reward,
    uint256 maxUpdateFrequency
  ) payable {
    _reward = reward;
    _maxUpdateFrequency = maxUpdateFrequency;
    _pluracleDataType = "uint256";
  }

  /// @dev update the data of the oracle by calculating the median between oracles
  function update() public {
    // Check that time has passed since last update
    require((now - _lastTimestamp) >= _maxUpdateFrequency );

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

    emit Updated(_data);

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(_reward);
  }

  /// @dev Edit the oracle properties
  /// @param reward bytes32 the wei reward per update
  /// @param maxUpdateFrequency new max update frequency
  function edit(uint256 reward, uint256 maxUpdateFrequency) onlyOwner public {
    _reward = reward;
    _maxUpdateFrequency = maxUpdateFrequency;
  }

  /// @dev Add an oracle source
  /// @param newOracle new oracle address
  function addOracle(address newOracle) onlyOwner public {
    require(newOracle != address(this));

    bytes32 newOracleTypeHash = keccak256(IDataFeedOracle(newOracle).dataType());
    require(newOracleTypeHash == keccak256(_pluracleDataType));
    _oracles.push(IDataFeedOracle(newOracle));
  }

  /// @dev remove an oracle
  /// @param oracleIndex the index of the oracle to be removed
  function removeOracle(uint256 oracleIndex) onlyOwner public {
    delete _oracles[oracleIndex];
  }

  /// @dev get oracle data type
  function dataType() public view returns (string) {
    return "uint256";
  }

  /// @dev get oracle last timestamp updated
  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  /// @dev get oracle data
  function data() public view returns (uint256) {
    return _data;
  }

  /// @dev get oracle data reward
  function reward() public view returns (uint256) {
    return _reward;
  }

  /// @dev get oracles list
  function oracles() public view returns (IDataFeedOracle[]) {
    return _oracles;
  }

  function() payable {}

}
