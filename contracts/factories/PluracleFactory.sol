pragma solidity 0.4.24;

import '../OracleRegistry.sol';
import '../oracles/Pluracle.sol';

/**
 * @title PluracleFactory
 * @dev A factory for creating signed oracles
 */
contract PluracleFactory {

  /// @dev Event for logging the creation of a signed oracle
  /// @param addr The oracle address
  /// @param owner The owner of the signed oracle
  event PluracleCreated(address addr, address owner);

  OracleRegistry public registry;

  function PluracleFactory(address _registry) public {
    registry = OracleRegistry(_registry);
  }

  function create(uint256 _reward, uint256 _timeDelayAllowed, string _description) payable public {
    Pluracle pluracle = new Pluracle(_reward, _timeDelayAllowed);

    // Forward funds to the new oracle
    pluracle.transfer(msg.value);

    // Transfer ownership from factory to message sender
    pluracle.transferOwnership(msg.sender);

    registry.addOracle('pluracle:uint256', pluracle, msg.sender, "uint256", _description);

    PluracleCreated(pluracle, msg.sender);
  }
}
