pragma solidity ^0.4.24;

import "./IDataFeedOracle.sol";

/**
 * @title IDataFeedOracleV2
 * @dev A data feed oracle with decimals
 */
contract IDataFeedOracleV2 is IDataFeedOracle {
  function decimals() public view returns (uint8);
}
