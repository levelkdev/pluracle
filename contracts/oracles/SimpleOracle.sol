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

  function update(uint256 data) public onlyOwner {
    _lastTimestamp = now;
    _data = data;
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

  function() payable {}

}
