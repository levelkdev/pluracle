pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title SignedOracle
 * @dev An oracle that will require the a signature of the owner to be updated.
 */
contract SignedOracle is Ownable {
  using SafeMath for uint256;

  bytes32 public _data;
  uint256 public _reward;
  uint256 public _timeDelayAllowed;
  uint256 public _lastTimestamp;
  string public _dataType;

  event Updated(bytes32 newData);

  /// @dev Constructor
  /// @param reward bytes32 the wei reward per update
  /// @param timeDelayAllowed maximun amount of time that the data can be outdated
  /// @param dataType type of the oracle data
  function SignedOracle(
    uint256 reward, uint256 timeDelayAllowed, string dataType
  ) payable public{
    _reward = reward;
    _timeDelayAllowed = timeDelayAllowed;
    _dataType = dataType;
  }

  /// @dev Update the oracle data
  /// @param data the new data to be updated
  /// @param dataTimestamp the timestamp of the data provided
  /// @param signature the signature of the oracle owner
  function update(bytes32 data, uint256 dataTimestamp, bytes signature) public {
    // Check the dataTimestamp is not too old
    require(now.sub(dataTimestamp) <= _timeDelayAllowed);

    // Generate message hash
    bytes32 messageSigned = keccak256(data, dataTimestamp);
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 messageSigned = sha3(data, dataTimestamp);
    bytes32 prefixedHash = sha3(prefix, messageSigned);

    // Recover signer from the signature with messageSigned
    address signer = ECRecovery.recover(prefixedHash, signature);

    // Check that the signer is the owner
    require(signer == owner);

    // Update the oracle data
    _data = data;
    _lastTimestamp = now;

    Updated(_data);

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(_reward);
  }

  /// @dev Edit the oracle properties
  /// @param reward bytes32 the wei reward per update
  /// @param timeDelayAllowed maximun amount of time that the data can be outdated
  function edit(uint256 reward, uint256 timeDelayAllowed) onlyOwner public {
    _reward = reward;
    _timeDelayAllowed = timeDelayAllowed;
  }

  /// @dev Get the type of the data provided
  function dataType() public view returns (string) {
    return _dataType;
  }

  /// @dev Get the last time where the oracle was updated
  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  /// @dev Get the oracle data
  function data() public view returns (bytes32) {
    return _data;
  }

  /// @dev Get reward per update
  function reward() public view returns (uint256) {
    return _reward;
  }

  /// @dev Get the time delay allowed
  function timeDelayAllowed() public view returns (uint256) {
    return _timeDelayAllowed;
  }

}
