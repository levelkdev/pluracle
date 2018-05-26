pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title OracleRegistry
 * @dev A list of oracles in the network along with a brief description
 */
contract OracleRegistry is Ownable {

  /// @dev Event for logging the addition of an oracle to the registry
  /// @param oracleType The type of the oracle
  /// @param addr The address of the oracle contract
  /// @param owner The owner of the oracle contract
  /// @param dataType The data type of the oracle data feed
  /// @param description The description of the oracle
  event OracleAdded(string oracleType, address addr, address owner, string dataType, string description);

  /// @dev Event for logging the removal of an oracle from the registry
  /// @param oracleType The type of the oracle
  /// @param addr The address of the oracle contract
  event OracleRemoved(string oracleType, address addr);

  /// @dev Event for logging the update of an oracle description
  /// @param oracleType The type of the oracle
  /// @param addr The address of the oracle contract
  /// @param description The description of the oracle
  event OracleDescriptionUpdated(string oracleType, address addr, string description);

  // Struct of information about oracle
  struct Oracle {
    uint256 listIndex;
    address owner;
    string dataType;
    string description;
  }

  // Struct of information about oracle
  struct OracleType {
    // Array of oracle addresses
    address[] list;
    // Map of oracle addresses to oracle structs
    mapping(address => Oracle) index;
  }

  // Map of oracle by types
  mapping(address => string) oracles;

  // Mapping of oracle types
  mapping(string => OracleType) oracleTypes;

  /// @dev Constructor for setting up OracleRegistry
  function OracleRegistry() {
    // TODO It might make sense to have the OracleFactory own the registry? Should we set this in the constructor?
  }

  /// @dev Function for adding an oracle to the registry
  /// @param _type Oracle type to be added
  /// @param _address Address of the oracle contract
  /// @param _owner Address of the owner of the oracle contract
  /// @param _dataType Type of data of the Oracle of the data feed
  /// @param _description Type of data of the Oracle of the data feed
  function addOracle(string _type, address _address, address _owner, string _dataType, string _description) onlyOwner public {
    // get index of next address being added (same as length before oracle is added)
    uint256 _index = oracleTypes[_type].list.length;

    oracleTypes[_type].list.push(_address);

    oracleTypes[_type].index[_address] = Oracle(_index, _owner, _dataType, _description);

    emit OracleAdded(_type, _address, _owner, _dataType, _description);
  }

  /// @dev Function for removing an oracle from the registry
  /// @param _address Address of the oracle contract to remove
  function removeOracle(address _address) onlyOwner public {
    // fetch oracle type
    string _type = oracles[_address];

    // fetch oracle information
    Oracle _oracle = oracleTypes[_type].index[_address];

    // remove oracle from the oracle addresses array
    delete oracleTypes[_type].list[_oracle.listIndex];

    // remove oracle data struct from mapping of oracle data structs
    delete oracles[_address];

    emit OracleRemoved(_type, _address);
  }

  /// @dev Function for updating an oracel description
  /// @param _address Address of the oracle being updated
  /// @param _description New description for the oracle
  function updateOracleDescription(address _address, string _description) public {
    // fetch oracle type
    string _type = oracles[_address];

    // fetch oracle information
    Oracle _oracle = oracleTypes[_type].index[_address];

    // require caller of function to be the owner of the oracle
    require(_oracle.owner == msg.sender);

    // update description
    _oracle.description = _description;

    emit OracleDescriptionUpdated(_type, _address, _description);
  }
}
