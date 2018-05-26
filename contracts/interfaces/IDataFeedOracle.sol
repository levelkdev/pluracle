pragma solidity ^0.4.24;

/**
 * @title IDataFeedOracle
 * @dev An oracle that will feed some data outside of the network
 */
contract IDataFeedOracle {
  event Updated(bytes32 newData);
  function dataType() public view returns (string);
  function lastTimestamp() public view returns (uint256);
  function data() public view returns (bytes32);
}
