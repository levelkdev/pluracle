pragma solidity 0.4.24;

import '../interfaces/IDataFeedOracle.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title SimpleOracle
 * @dev An oracle whose value is set by its owner
 */
contract SimpleOracle is IDataFeedOracle, Ownable {

  uint256 _lastTimestamp;
  uint256 _data;

  /// @dev Update the oracle data, called by toracle owner
  /// @param data the new data to be stored
  function update(uint256 data) public onlyOwner {
    _lastTimestamp = now;
    _data = data;
    Updated(_data);
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

  function() payable {}

}
