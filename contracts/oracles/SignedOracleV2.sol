pragma solidity 0.4.24;

import "./SignedOracleV1.sol";

/**
 * @title SignedOracleV2
 * @dev An oracle that will require the a signature of the owner to be updated.
 */
contract SignedOracleV2 is SignedOracleV1 {

  uint8 public _decimals;

  /// @dev initialize
  /// @param decimals deciamls used on the data provided
  function initialize(
    uint8 decimals
  ) {
    _decimals = decimals;
  }

  function decimals() public view returns(uint8) {
    return _decimals;
  }

}
