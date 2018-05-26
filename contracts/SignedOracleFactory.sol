pragma solidity 0.4.24;


import './SignedOracle.sol';

/**
 * @title SignedOracleFactory
 * @dev A factory for creating signed oracles
 */
contract SignedOracleFactory {

  /// @dev Event for logging the creation of a signed oracle
  /// @param reward The reward paid out for updating the oracle
  /// @param timeDelayAllowed The time allowed 
  /// @param dataType The type of data provided by the oracle
  /// @param owner The owner of the signed oracle
  event SignedOracleCreated(uint256 reward, uint256 timeDelayAllowed, string dataType, address owner);

  function createdSignedOracle(uint256 _reward, uint256 _timeDelayAllowed, string _dataType) public {
    SignedOracle signedOracle = new SignedOracle(_reward, _timeDelayAllowed, _dataType);
    
    // Transfer ownership from factory to message sender
    signedOracle.transferOwnership(msg.sender);
    
    SignedOracleCreated(_reward, _timeDelayAllowed, _dataType, msg.sender);
  }
}
