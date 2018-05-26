pragma solidity 0.4.24;

import './IDataFeedOracle';
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "zeppelin-solidity/contracts/SafeMath.sol";


/**
 * @title SignedOracle
 * @dev An oracle that will require the a signature of the owner to be updated.
 */
contract SignedOracle {
  using SafeMath for uint256;

  bytes public _lastData;
  uint256 public _reward;
  uint256 public _timeDelayAllowed;
  uint256 public _lastTimestamp;
  string public _dataType;

  function SignedOracle(
    uint256 reward, uint256 timeDelayAllowed, string dataType
  ) {
    _reward = reward;
    _timeDelay = timeDelayAllowed;
    _dataType = dataType;
  }

  function update(bytes data, uint256 dataTimestamp, bytes signature) public {
    // Check the dataTimestamp is not too old
    require(now.sub(dataTimestamp) < timeDelay);

    // Generate message hash
    bytes32 messageSigned = sha3(data, dataTimestamp);

    // Recover signer from the signature with messageSigned
    address signer = ECRecovery.recover(messageSigned, signature);

    // Check that the signer is the owner
    require(signer == owner);

    // Update the oracle data
    _data = data;
    _lastTimestamp = now;

    // Tranfer the update reward to the msg.sender
    msg.sender.transfer(reward);
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
