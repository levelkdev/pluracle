pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title OracleCasting
 * @dev A library to cast generic values from IDataFeed oracles
 */
library OracleCasting {

  /// @dev Cast a string from a bytes32 variable
  /// @param data bytes32 data to be parsed
  function bytesToString(bytes32 data) public view returns(string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }

  /// @dev Cast a int from a bytes32 variable
  /// @param data bytes32 data to be parsed
  function bytesToInt(bytes32 data) public view returns(int) {
    return int(data);
  }

  /// @dev Cast a uint from a bytes32 variable
  /// @param data bytes32 data to be parsed
  function bytesToUint(bytes32 data) public view returns(uint256) {
    return uint256(data);
  }

  /// @dev Cast a bool from a bytes32 variable
  /// @param data bytes32 data to be parsed
  function bytesToBool(bytes32 data) public view returns(bool) {
    return (data != bytes32(0));
  }

  /// @dev Cast an address from a bytes32 variable
  /// @param data bytes32 data to be parsed
  function bytesToAddress(bytes32 data) public view returns(address) {
    return address(data);
  }

}
