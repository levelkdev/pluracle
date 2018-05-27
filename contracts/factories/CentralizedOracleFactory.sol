pragma solidity 0.4.24;

import '../OracleRegistry.sol';
import '../oracles/CentralizedOracle.sol';

/**
 * @title CentralizedOracleFactory
 * @dev A factory for creating centralized oracles
 */
contract CentralizedOracleFactory {

  /// @dev Event for logging the creation of a centralized oracle
  /// @param dataType The type of data being returned by the oracle
  /// @param owner The owner of the centralized oracle
  event CentralizedOracleCreated(string dataType, address owner);

  OracleRegistry public registry;

  function CentralizedOracleFactory(address _registry) public {
    registry = OracleRegistry(_registry);
  }

  /// @dev Function for creating a centralized oracle
  /// @param _dataType The type of data returned by the oracle
  function createCentralizedOracle(string _dataType, string _description) public returns (CentralizedOracle) {

    CentralizedOracle centralizedOracle = new CentralizedOracle(_dataType);

    // Transfer ownership from factory to message sender
    centralizedOracle.transferOwnership(msg.sender);

    registry.addOracle('centralized:uint256', centralizedOracle, msg.sender, "uint256", _description);

    CentralizedOracleCreated(_dataType, msg.sender);
  }
}
