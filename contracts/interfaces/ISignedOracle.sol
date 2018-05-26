pragma solidity 0.4.24;

import './IDataFeedOracle';

contract ISignedOracle is IDataFeedOracle {
  function update(bytes value, uint256 startTimestamp, uint256 endTimestamp, bytes _signature) public;
  function edit(uint256 _reward, uint256 _timeDelay) onlyOwner;
  function getOwner() public view returns (address);
  function reward() public view returns (uint256);
  function timeDelayAllowed() public view returns (uint256);
}
