pragma solidity 0.4.24;

import '../OracleRegistry.sol';
import '../oracles/SignedOracle.sol';

/**
 * @title SignedOracleFactory
 * @dev A factory for creating signed oracles
 */
contract SignedOracleFactory {

  /// @dev Event for logging the creation of a signed oracle
  /// @param addr The oracle address
  /// @param owner The owner of the signed oracle
  event SignedOracleCreated(address addr, address owner);

  OracleRegistry public registry;

  function SignedOracleFactory(address _registry) public {
    registry = OracleRegistry(_registry);
  }

  function create(uint256 _reward, uint256 _timeDelayAllowed, string _description) payable public {
    SignedOracle signedOracle = new SignedOracle(_reward, _timeDelayAllowed);

    // Forward funds to the new oracle
    signedOracle.transfer(msg.value);

    // Transfer ownership from factory to message sender
    signedOracle.transferOwnership(msg.sender);

    registry.addOracle('signed:uint256', signedOracle, msg.sender, "uint256", _description);

    SignedOracleCreated(signedOracle, msg.sender);
  }
}
