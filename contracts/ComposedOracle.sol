pragma solidity 0.4.24;

import './interfaces/IDataFeedOracle.sol';

/**
 * @title ComposedOracle
 * @dev An oracle composed of other oracles. Each oracle can be challenged by placing
 *      a deposit. The loser of the challenge's deposit is used to pay for the next
 *      oracle the remainder is paid out to the winner of the challenge. The next 
 *      oracle in the oracle chain is only triggered if the oracle before it is
 *      challenged. The final oracle in the chain can not be challenged.
 */
contract ComposedOracle is IDataFeedOracle {

  string _dataType;
  uint256 _lastTimestamp;
  bytes _data;

  function CentralizedOracle(string dataType) public {
    _dataType = dataType;
  }

  function update(bytes data) public onlyOwner {
    _lastTimestamp = now;
    _data = data;
  }

  function dataType() public view returns (string) {
    return _dataType;
  }

  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  function data() public view returns (bytes) {
    return _data;
  }

}

contract WindingTree {
  IDataFeedOracle someOracle;
  
  function someFunction() {
    bytes data = someOracle.data;
    uint price = OracleCasting.bytesToUint(data);
  }
}
