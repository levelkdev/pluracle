pragma solidity 0.4.24;

import './SignedOracle.sol';

contract MakerSignedOracle is SignedOracle {
  
  function MakerSignedOracle(uint256 reward, uint256 timeDelayAllowed, string dataType)
  SignedOracle(reward, timeDelayAllowed, dataType)
    public
  {}

  function peek() external view returns (bytes32, bool) {
    return (bytes32(data()), now.sub(lastTimestamp()) <= _timeDelayAllowed);
  }

  function read() external view returns (bytes32) {
    return bytes32(data());
  }
}
