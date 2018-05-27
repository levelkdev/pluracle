pragma solidity 0.4.24;

import '../OracleRegistry.sol';
import '../oracles/SimpleOracle.sol';

/**
 * @title SimpleOracleFactory
 * @dev A factory for creating SimpleOracle oracles
 */
contract SimpleOracleFactory {

  /// @dev Event for logging the creation of a simple oracle
  /// @param addr The oracle address
  /// @param owner The owner of the simple oracle
  event SimpleOracleCreated(address addr, address owner);

  OracleRegistry public registry;

  function SimpleOracleFactory(address _registry) public {
    registry = OracleRegistry(_registry);
  }

  /// @dev Function for creating a SimpleOracle oracle
  function create(string _description) payable public {

    SimpleOracle simpleOracle = new SimpleOracle();

    // Transfer ownership from factory to message sender
    simpleOracle.transferOwnership(msg.sender);

    registry.addOracle('simple:uint256', simpleOracle, msg.sender, "uint256", _description);

    SimpleOracleCreated(simpleOracle, msg.sender);
  }
}
