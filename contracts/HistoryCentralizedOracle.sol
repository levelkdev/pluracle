pragma solidity 0.4.24;

import './interfaces/IHistoryDataFeedOracle.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract HistoryCentralizedOracle is IHistoryDataFeedOracle, Ownable {
  using SafeMath for uint256;

  struct DataPoint {
    bytes32 data;
    uint dataTimestamp;
    bool exists;
  }

  string _dataType;
  uint256 _lastTimestamp;
  bytes32 _data;
  uint public _updatePeriod;
  uint public _numDataPoints;
  DataPoint[] public _history;

  function HistoryOracle(string dataType, uint updatePeriod, numDataPoints)
    public 
  {
    _dataType = dataType;
    _updatePeriod = updatePeriod;
    _numDataPoints = numDataPoints;
  }

  function dataAtTimestamp(uint dataTimestamp) public view returns (bytes32) {
    DataPoint dataPoint = _history[(dataTimestamp / _updatePeriod) % _numDataPoints];
    require(dataPoint.exists);
    require(dataTimestamp.add(_updatePeriod) > dataPoint.dataTimestamp && dataTimestamp.sub(_updatePeriod) < dataPoint.dataTimestamp);
    return dataPoint.data;
  }

  function update(bytes32 data, uint256 dataTimestamp) public onlyOwner {
    require(dataTimestamp > _lastTimestamp);
    _lastTimestamp = dataTimestamp;
    _history[(dataTimestamp / _updatePeriod) % _numDataPoints] = DataPoint(data, dataTimestamp, true);
  }

  function hasDatapoint(uint dataTimestamp) public view returns (bool) {
    DataPoint dataPoint = _history[(dataTimestamp / _updatePeriod) % _numDataPoints];
    return dataPoint.exists && dataTimestamp.add(_updatePeriod) > dataPoint.dataTimestamp;
  }
  
  function dataType() public view returns (string) {
    return _dataType;
  }

  function lastTimestamp() public view returns (uint256) {
    return _lastTimestamp;
  }

  function data() public view returns (bytes32) {
    return _data;
  }
}
