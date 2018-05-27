pragma solidity 0.4.24;

import '../OracleRegistry.sol';
import '../oracles/SimpleOracle.sol';

/**
 * @title SimpleOracleFactory
 * @dev A factory for creating SimpleOracle oracles
 */
contract SimpleOracleFactory {

  /// @dev Event for logging the creation of a SimpleOracle oracle
  /// @param dataType The type of data being returned by the oracle
  /// @param owner The owner of the SimpleOracle oracle
  event SimpleOracleCreated(string dataType, address owner);

  OracleRegistry public registry;

  function SimpleOracleFactory(address _registry) public {
    registry = OracleRegistry(_registry);
  }

  /// @dev Function for creating a SimpleOracle oracle
  /// @param _dataType The type of data returned by the oracle
  function createSimpleOracle(string _dataType, string _description) payable public {

    SimpleOracle simpleOracle = new SimpleOracle(_dataType);

    // Forward funds to the new oracle
    simpleOracle.transfer(msg.value);

    // Transfer ownership from factory to message sender
    simpleOracle.transferOwnership(msg.sender);

    registry.addOracle('SimpleOracle:uint256', simpleOracle, msg.sender, "uint256", _description);

    SimpleOracleCreated(_dataType, msg.sender);
  }
}
