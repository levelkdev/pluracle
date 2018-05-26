pragma solidity ^0.4.24;

/**
 * @title IDataFeedOracle
 * @dev An oracle that will feed some data outside of the network
 */
contract IDataFeedOracle {
  function getDataType() public view returns (string);
  function getLastTimestamp() public view returns (uint256);
  function getData() public view returns (bytes);
}
