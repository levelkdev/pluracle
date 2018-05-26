pragma solidity 0.4.24;

import './IDataFeedOracle.sol';

/**
 * @title ISignedOracle
 * @dev Signed oracle interface, an oracle that will require the a signature of the ENS owner to be updated.
 */
contract IENSSignedOracle is IDataFeedOracle {
  function update(bytes data, uint256 dataTimestamp, bytes signature) public;
  function edit(uint256 reward, uint256 timeDelayAllowed) public;
  function getOwner() public view returns (address);
  function getENSOwner() public view returns (string);
  function reward() public view returns (uint256);
  function timeDelayAllowed() public view returns (uint256);
}
