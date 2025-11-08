# Polar MCP Tools Reference

The Polar MCP server provides 40+ tools for managing Lightning Network test environments. Tools are organized by category and dynamically discovered from the Polar application.

## Table of Contents

- [Network Management (12 tools)](#network-management-12-tools)
  - [Core Network Operations](#core-network-operations)
  - [Node Management (7 tools)](#node-management-7-tools)
  - [Node Configuration (3 tools)](#node-configuration-3-tools)
- [Bitcoin Operations (5 tools)](#bitcoin-operations-5-tools)
- [Lightning Network Operations (13 tools)](#lightning-network-operations-13-tools)
  - [Wallet Operations](#wallet-operations)
  - [Channel Operations](#channel-operations)
  - [Payment Operations](#payment-operations)
  - [Node Information](#node-information)
- [Taproot Assets Operations (7 tools)](#taproot-assets-operations-7-tools)
  - [Asset Management](#asset-management)
  - [Asset Transfers](#asset-transfers)
  - [Universe Operations](#universe-operations)
- [Asset Channels (3 tools)](#asset-channels-3-tools)
- [Asset Payments (2 tools)](#asset-payments-2-tools)
- [Lightning Terminal Operations (3 tools)](#lightning-terminal-operations-3-tools)
  - [Session Management](#session-management)

## Network Management (12 tools)

### Core Network Operations

#### `list_networks`

Lists all Lightning Network test networks with their configurations and status.

**Returns**: Array of networks with id, name, description, status, and node counts

#### `create_network`

Creates a new Lightning Network test network with specified node implementations and versions.

**Parameters**:

- `name` (required): Name of the network
- `description` (optional): Description of the network
- `nodes` (optional): List of nodes to include
  - `implementation` (required): Node type ('bitcoind', 'LND', 'c-lightning', 'eclair', 'litd', 'tapd')
  - `version` (optional): Version to use (latest if omitted)
  - `count` (optional): Number of nodes (default: 1)

**Returns**: Created network details

#### `rename_network`

Rename a network and update its description.

**Parameters**:

- `networkId` (required): ID of the network
- `name` (required): New name for the network
- `description` (optional): New description for the network

#### `start_network`

Starts all nodes in a Lightning Network.

**Parameters**:

- `networkId` (required): ID of the network to start

#### `stop_network`

Stops all nodes in a Lightning Network.

**Parameters**:

- `networkId` (required): ID of the network to stop

#### `delete_network`

Permanently deletes a Lightning Network.

**Parameters**:

- `networkId` (required): ID of the network to delete

### Node Management (7 tools)

#### `list_node_versions`

Lists supported versions for all node implementations.

**Returns**: Available versions for each node type

#### `add_node`

Adds a new node to an existing network.

**Parameters**:

- `networkId` (required): ID of the network
- `type` (required): Node implementation type
- `version` (optional): Version to use

#### `start_node`

Starts a specific node in a network.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the node to start

#### `stop_node`

Stops a specific node in a network.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the node to stop

#### `remove_node`

Removes a node from a network.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the node to remove

#### `rename_node`

Renames a node in a network.

**Parameters**:

- `networkId` (required): ID of the network
- `oldName` (required): Current name of the node
- `newName` (required): New name for the node

#### `restart_node`

Restarts a specific node in a network.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the node to restart

### Node Configuration (3 tools)

#### `update_node_command`

Updates the custom command for a node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the node
- `command` (required): New command to use

#### `get_default_node_command`

Gets the default command template for a node implementation.

**Parameters**:

- `implementation` (required): Node implementation type

#### `set_lightning_backend`

Sets the backend Bitcoin node for a Lightning node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `backendName` (required): Name of the Bitcoin backend node

#### `set_tap_backend`

Sets the backend LND node for a Taproot Assets node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node
- `backendName` (required): Name of the LND backend node

## Bitcoin Operations (5 tools)

#### `mine_blocks`

Mines Bitcoin blocks in a network.

**Parameters**:

- `networkId` (required): ID of the network
- `blocks` (optional, default: 6): Number of blocks to mine
- `nodeName` (optional): Name of the Bitcoin node

#### `get_blockchain_info`

Gets blockchain information from a Bitcoin node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (optional): Name of the Bitcoin node

#### `send_bitcoin`

Sends on-chain Bitcoin transaction from a Bitcoin node.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Name of the sending Bitcoin node
- `toAddress` (required): Destination Bitcoin address
- `amount` (required): Amount in BTC
- `autoMine` (optional): Auto-mine transaction

#### `get_new_bitcoin_address`

Generates a new Bitcoin address for a node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (optional): Name of the node

#### `get_bitcoin_wallet_info`

Gets Bitcoin wallet balance and transaction information.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (optional): Name of the Bitcoin node

#### `set_auto_mine_mode`

Sets the auto-mining mode for a network.

**Parameters**:

- `networkId` (required): ID of the network
- `mode` (required): Auto-mine mode ('manual', 'auto', 'timed')

## Lightning Network Operations (13 tools)

### Wallet Operations

#### `get_wallet_balance`

Gets on-chain wallet balance for a Lightning node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node

#### `deposit_funds`

Deposits Bitcoin to a Lightning node's on-chain wallet.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `sats` (required): Amount in satoshis

### Channel Operations

#### `open_channel`

Opens a Lightning channel between two nodes.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Source Lightning node name
- `toNode` (required): Destination Lightning node name
- `sats` (required): Channel capacity in satoshis
- `isPrivate` (optional): Whether channel is private
- `autoFund` (optional): Auto-deposit funds if needed

#### `close_channel`

Closes a Lightning channel.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `channelPoint` (required): Channel point identifier

#### `list_channels`

Lists all channels for a Lightning node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node

### Payment Operations

#### `create_invoice`

Creates a Lightning payment invoice.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `amount` (required): Amount in satoshis
- `memo` (optional): Invoice description

#### `pay_invoice`

Pays a Lightning invoice.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Name of the paying Lightning node
- `invoice` (required): Lightning invoice string
- `amount` (optional): Amount override

### Node Information

#### `get_node_info`

Gets Lightning node information including pubkey, alias, sync status.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node

## Taproot Assets Operations (7 tools)

### Asset Management

#### `mint_tap_asset`

Mints a new Taproot Asset.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node
- `assetType` (required): 'normal' or 'collectible'
- `name` (required): Asset name
- `amount` (required): Amount to mint
- `decimals` (optional): Decimal precision
- `enableEmission` (optional): Enable future emission
- `finalize` (optional): Finalize asset immediately
- `autoFund` (optional): Auto-mine transaction

#### `list_tap_assets`

Lists all Taproot Assets.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (optional): Name of the Taproot Assets node

#### `get_tap_balances`

Gets Taproot Asset balances.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node

### Asset Transfers

#### `send_tap_asset`

Sends Taproot Assets to an address.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Name of the sending Taproot Assets node
- `address` (required): Destination asset address
- `autoFund` (optional): Auto-mine transaction

#### `get_tap_address`

Generates a new Taproot Asset address.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node
- `assetId` (required): Asset ID
- `amount` (required): Amount for address

#### `decode_tap_address`

Decodes a Taproot Asset address.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node
- `address` (required): Asset address to decode

### Universe Operations

#### `sync_tap_universe`

Syncs with the Taproot Assets universe.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Taproot Assets node
- `hostname` (required): Universe server hostname

## Asset Channels (3 tools)

#### `fund_tap_channel`

Funds a Lightning channel with Taproot Assets.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Source Lightning node name
- `toNode` (required): Destination Lightning node name
- `assetId` (required): Asset ID to use for funding
- `amount` (required): Amount of assets

#### `close_tap_channel`

Closes a Taproot Asset channel.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `channelPoint` (required): Channel point identifier

#### `get_assets_in_channels`

Gets available assets in Lightning channels.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node

## Asset Payments (2 tools)

#### `create_asset_invoice`

Creates an invoice payable with Taproot Assets.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the Lightning node
- `assetId` (required): Asset ID for payment
- `amount` (required): Amount of assets

#### `pay_asset_invoice`

Pays an invoice with Taproot Assets.

**Parameters**:

- `networkId` (required): ID of the network
- `fromNode` (required): Name of the paying Lightning node
- `assetId` (required): Asset ID to use for payment
- `invoice` (required): Lightning invoice string

## Lightning Terminal Operations (3 tools)

### Session Management

#### `list_litd_sessions`

Lists all LNC sessions for a litd node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the litd node

#### `add_litd_session`

Creates a new LNC session for a litd node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the litd node
- `label` (required): Session label
- `type` (required): Session type ('admin', 'read_only', 'custom')
- `expiresAt` (optional): Expiration timestamp
- `mailboxServerAddr` (optional): Mailbox server address

#### `revoke_litd_session`

Revokes an LNC session for a litd node.

**Parameters**:

- `networkId` (required): ID of the network
- `nodeName` (required): Name of the litd node
- `localPublicKey` (required): Session public key

---

**Total: 40+ tools** across all categories. Tools are dynamically discovered from Polar, so this list may expand with future Polar releases.
