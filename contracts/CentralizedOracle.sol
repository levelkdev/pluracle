pragma solidity 0.4.24;

import './interfaces/IDataFeedOracle.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title CentralizedOracle
 * @dev An oracle whose value is set by its owner
 */
contract CentralizedOracle is IDataFeedOracle, Ownable {

  string _dataType;
  uint256 _lastTimestamp;
  bytes _data;

  function CentralizedOracle(string dataType) public {
    _dataType = dataType;
  }

  function update(bytes data) public onlyOwner {
    _lastTimestamp = now;
    _data = data;
  }

  function dataType() public view returns (string) {
    return _dataType;
  }

  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  function data() public view returns (bytes) {
    return _data;
  }

}
