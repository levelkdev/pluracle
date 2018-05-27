pragma solidity 0.4.24;

import './IDataFeedOracle.sol';

/**
 * @title IHistoryDataFeedOracle
 * @dev Oracle interface for oracle that tracks its history
 */
contract IHistoryDataFeedOracle is IDataFeedOracle {
  function dataAtTimestamp(uint dataTimestamp) public view returns (uint256);
}
