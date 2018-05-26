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

  bytes public _data;
  uint256 public _reward;
  uint256 public _timeDelayAllowed;
  uint256 public _lastTimestamp;
  string public _dataType;

  function SignedOracle(
    uint256 reward, uint256 timeDelayAllowed, string dataType
  ) payable {
    _reward = reward;
    _timeDelayAllowed = timeDelayAllowed;
    _dataType = dataType;
  }

  event log(bytes32 msg);

  function update(bytes data, uint256 dataTimestamp, bytes signature) public {
    // Check the dataTimestamp is not too old
    require(now.sub(dataTimestamp) <= _timeDelayAllowed);

    // Generate message hash
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

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(_reward);
  }

  function edit(uint256 reward, uint256 timeDelayAllowed) onlyOwner {
    _reward = reward;
    _timeDelayAllowed = timeDelayAllowed;
  }

  function getDataType() public view returns (string) {
    return (_dataType);
  }

  function getLastTimestamp() public view returns (uint256) {
    return (_lastTimestamp);
  }

  function getData() public view returns (bytes) {
    return (_data);
  }

  function reward() public view returns (uint256) {
    return (_reward);
  }

  function timeDelayAllowed() public view returns (uint256) {
    return (_timeDelayAllowed);
  }

}
