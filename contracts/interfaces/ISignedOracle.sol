pragma solidity 0.4.24;

import './IDataFeedOracle';

/**
 * @title ISignedOracle
 * @dev Signed oracle interface, an oracle that will require the a signature of the owner to be updated.
 */
contract ISignedOracle is IDataFeedOracle {
  function update(bytes data, uint256 dataTimestamp, bytes signature) public;
  function edit(uint256 reward, uint256 timeDelayAllowed) onlyOwner;
  function transferOwnership(address newOwner) onlyOwner;
  function getOwner() public view returns (address);
  function reward() public view returns (uint256);
  function timeDelayAllowed() public view returns (uint256);
}
