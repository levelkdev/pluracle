pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title OracleRegistry
 * @dev A list of oracles in the network along with a brief description
 */
contract OracleRegistry is Ownable {

  /// @dev Event for logging the addition of an oracle to the registry
  /// @param oracleAddress The address of the oracle contract
  /// @param owner The owner of the oracle contract
  /// @param dataType The data type of the oracle data feed
  /// @param description The description of the oracle
  event OracleAdded(address oracleAddress, address owner, string dataType, string description);

  /// @dev Event for logging the removal of an oracle from the registry
  /// @param oracleAddress The address of the oracle contract
  /// @param owner The owner of the oracle contract
  /// @param dataType The data type of the oracle data feed
  /// @param description The description of the oracle
  event OracleRemoved(address oracleAddress, address owner, string dataType, string description);

  /// @dev Event for logging the update of an oracle description
  /// @param oracleAddress The address of the oracle contract
  /// @param owner The owner of the oracle contract
  /// @param dataType The data type of the oracle data feed
  /// @param description The description of the oracle
  event OracleDescriptionUpdated(address oracleAddress, address owner, string dataType, string description);

  // Array of oracle addresses
  address[] public oracleAddresses;

  // Struct of information about oracle
  struct Oracle {
    uint256 oracleAddressesIndex;
    address owner;
    string dataType;
    string description;
  }

  // Map of oracle addresses to oracle structs
  mapping(address => Oracle) oracles;

  /// @dev Constructor for setting up OracleRegistry
  function OracleRegistry() {
    // TODO It might make sense to have the OracleFactory own the registry? Should we set this in the constructor?
  }

  /// @dev Function for adding an oracle to the registry
  /// @param _address Address of the oracle contract
  /// @param _owner Address of the owner of the oracle contract
  /// @param _dataType Type of data of the Oracle of the data feed
  /// @param _description Type of data of the Oracle of the data feed
  function addOracle(address _address, address _owner, string _dataType, string _description) onlyOwner public {
    // get index of next address being added (same as length before oracle is added)
    uint256 _index = oracleAddresses.length;

    oracleAddresses.push(_address);

    oracles[_address] = Oracle(_index, _owner, _dataType, _description);

    emit OracleAdded(_address, _owner, _dataType, _description);
  }
	
  /// @dev Function for removing an oracle from the registry
  /// @param _address Address of the oracle contract to remove
  function removeOracle(address _address) onlyOwner public {
    // fetch oracle information
    Oracle storage _oracle = oracles[_address];

    // remove oracle from the oracle addresses array
    delete oracleAddresses[_oracle.oracleAddressesIndex];

    // remove oracle data struct from mapping of oracle data structs
    delete oracles[_address];
  }

  /// @dev Function for updating an oracel description
  /// @param _address Address of the oracle being updated
  /// @param _description New description for the oracle
  function updateOracleDescription(address _address, string _description) public {
    // fetch oracle information
    Oracle storage _oracle = oracles[_address];

    // require caller of function to be the owner of the oracle
    require(_oracle.owner == msg.sender);	

    // update description
    _oracle.description = _description;
  }
}
