pragma solidity 0.4.24;

import './interfaces/IHistoryDataFeedOracle.sol';
import './interfaces/IDataFeedOracle.sol';

/**
 * @title ComposableOracle
 * @dev An oracle composed of other oracles. Each oracle can be challenged by placing
 *      a deposit. The loser of the challenge's deposit is used to pay for the next
 *      oracle the remainder is paid out to the winner of the challenge. The next 
 *      oracle in the oracle chain is only triggered if the oracle before it is
 *      challenged. The final oracle in the chain can not be challenged.
 */
contract ComposableOracle is IDataFeedOracle {

  struct ChildOracle {
    IHistoryDataFeedOracle oracle;
    uint challengeAmount;
  }

  ChildOracle[] _childOracles;
  string _dataType;
  uint _challengePeriod;
  uint _currentOracleIndex = 0;

  function ComposableOracle(IHistoryDataFeedOracle[] oracles, uint[] challengeAmounts, uint challengePeriod) {
    require(oracles.length > 0);
    require(oracles.length == challengeAmounts.length - 1);
    require(challengePeriod > 0);

    _challengePeriod = challengePeriod;

    // Add a challenge amount of 0 for the last oracle. It will never be challenged.
    _dataType = oracles[0].dataType();
    for (uint i = 0; i < oracles.length; i++) {
      require(keccak256(oracles[i].dataType()) == keccak256(_dataType));
      uint challengeAmount = i == oracles.length - 1 ? 0 : challengeAmounts[i];
      _childOracles[i] = ChildOracle(oracles[i], challengeAmounts[i]);
    }
  }

  function challenge(uint oracleIndex) public payable {
    require(oracleIndex == _currentOracleIndex);
    // Can't challenge last oracle
    require(oracleIndex != _childOracles.length - 1);
    require(msg.value >= _childOracles[oracleIndex].challengeAmount);
    _currentOracleIndex++;
  }

  function dataType() public view returns (string) {
    return _dataType;
  }

  function lastTimestamp() public view returns (uint256) {
    // TODO: This is wrong. Need to return the lastTimestamp past the challenge period.
    return _childOracles[_currentOracleIndex].oracle.lastTimestamp();
  }

  function data() public view returns (bytes32) {
    return _childOracles[_currentOracleIndex].oracle.dataAtTimestamp(now - _challengePeriod);
  }
  
  // TODO: Resolve challenges
}
