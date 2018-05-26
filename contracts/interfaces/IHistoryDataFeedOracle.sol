pragma solidity 0.4.24;

import './IDataFeedOracle.sol';

/**
 * @title ISignedOracle
 * @dev Signed oracle interface, an oracle that will require the a signature of the ENS owner to be updated.
 */
contract IHistoryDataFeedOracle is IDataFeedOracle {
  function dataAtTimestamp(uint dataTimestamp) public view returns (bytes32);
}
