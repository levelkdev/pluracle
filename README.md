Pluracle
A network of oracles, starts automated oracles form 0 and expose offchain data on the blockchain super easily.

Signed Oracles
Oracles allows smart contract to access information outside the blockchain, this is a super useful tool but it a huge challenge to do in a decentralized trustless way.

Problems:
Trust the oracle owner.
Update the data frequently.
An incentive to update the data.
Verify some the data updated.
Not a 100% uptime.
Oracles ENS Verification
Each oracle will have an ENS owner, the only way for the oracle to be updated is with a valid signature of this ENS.

Oracle Health
The "health" of the oracle is defined by the: ETH Balance, life left with current reward, last block updated.

Governance
The oracle is owned by an ENS domain.

Upgradeability
Every oracle is upgradeable, they are created with zeppelinos ProxyFactory.

Destructible
Once the Oracle die it gets destructed.

Oracle Registry
A smart contract that will keep record of all oracles registered, the data they provide and a short description.

Oracle Factory
A smart contract to create upgradeable oracles easily and register them directly in the oracle registry.

Composed Oracle
A oracles of oracles.

How a signed oracle works
1.- oracle.windingtree.eth creates a new oracle where they will be uploading LIF/USD price. 2.- oracle.winidngtree.eth send ETH to the lif oracle contract. 3.- Winding Tree provides a signed price, the msg signed is sha3(lifPrice, startTimestamp, endTimestamp) 4.- Pepito wants to win some ETH, he calls the lif oracle contract to update the price and get some reward for it. Doing: update(lifPrice, startTimestamp, endTimestamp). 5.- Pepito receives ETH and anyone can get on chain an updated trusted price of LifToken.

1.- oracle.windingtree.eth creates a new oracle where they will be uploading LIF/USD price.
2.- oracle.winidngtree.eth send ETH to the lif oracle contract.
3.- Winding Tree provides a signed price, the msg signed is `sha3(lifPrice, startTimestamp, endTimestamp)`
4.- Pepito wants to win some ETH, he calls the lif oracle contract to update the price and get some reward for it. Doing: `update(lifPrice, startTimestamp, endTimestamp)`.
5.- Pepito receives ETH and anyone can get on chain an updated trusted price of LifToken.

## DataFeedOracle Interface

```
function getDataType() public view returns (string);
function getLastTimestamp() public view returns (uint256);
function getData() public view returns (bytes);
```

## SignedOracle Interface

```
function update(bytes value, uint256 startTimestamp, uint256 endTimestamp, bytes _signature) public;
function edit(uint256 _reward, uint256 _timeDelay) onlyOwner;
function getOwner() public view returns (address);
function reward() public view returns (uint256);
function timeDelayAllowed() public view returns (uint256);
```

## Whats next ?

- Multiple ENS ownership.
- Onchain SignedOracle lib.
