pragma solidity 0.4.24;

import './SignedOracle.sol';

contract MakerSignedOracle is SignedOracle {

  function peek() external view returns (bytes32,bool) {
    return (data(), now.sub(lastTimestamp()) <= _timeDelayAllowed);
  }

  function read() external view returns (bytes32) {
    return data();
  }

}
