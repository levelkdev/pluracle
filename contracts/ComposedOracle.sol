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
contract ComposedOracle {

}
