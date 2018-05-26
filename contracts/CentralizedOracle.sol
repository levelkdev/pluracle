pragma solidity 0.4.24;

import './interfaces/IDataFeedOracle.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title CentralizedOracle
 * @dev An oracle whose value is set by its owner
 */
contract CentralizedOracle is IDataFeedOracle, Ownable {
  
}
