# Polar MCP Server

Model Context Protocol (MCP) server for [Polar Lightning](https://lightningpolar.com). This server enables AI assistants like Claude to interact with Polar to manage Bitcoin Lightning Network test environments.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that enables AI assistants to securely connect to external data sources and tools. MCP servers expose capabilities that LLMs can discover and use dynamically.

## Features

- **Dynamic Tool Discovery**: Tools are defined in the Polar app and discovered at runtime, ensuring the MCP server stays compatible with all Polar versions
- **Real-time UI Updates**: All changes made through the MCP server are immediately reflected in the Polar UI
- **Network Management**: Create, start, stop, and manage complete Lightning Network test environments with Bitcoin and Lightning nodes
- **Bitcoin Operations**: Mine blocks, send transactions, check wallet balances, and monitor blockchain state
- **Lightning Network**: Open and close channels, create and pay invoices, manage node wallets, and monitor network health
- **Taproot Assets**: Mint, send, and manage Taproot Assets with full support for asset addresses and universe synchronization
- **Asset Channels**: Fund Lightning channels with Taproot Assets and create asset-enabled payment flows
- **Lightning Terminal**: Manage LNC sessions and create asset-backed Lightning invoices
- **Node Management**: Add, remove, start, stop, and configure individual nodes (LND, c-lightning, Eclair, litd, tapd, bitcoind)
- **Import/Export**: Backup and restore network configurations with ZIP file import/export

## Prerequisites

- [Polar](https://lightningpolar.com) must be installed and running
- Node.js 18 or higher

## Installation

### Option 1: Using npx (Recommended)

No installation needed! Add the below configuration to your MCP client.

### Option 2: Global Installation

```bash
yarn global add @lightningpolar/mcp
```

## Configuration

### Claude Desktop

Add this to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "polar": {
      "command": "npx",
      "args": ["-y", "@lightningpolar/mcp"]
    }
  }
}
```

Or if you installed globally:

```json
{
  "mcpServers": {
    "polar": {
      "command": "polar-mcp"
    }
  }
}
```

### Other MCP Clients

The server uses stdio transport and follows the MCP specification. It should work with any MCP-compatible client. Refer to your client's documentation for configuration instructions.

## Usage

1. **Start Polar**: Launch the Polar application
2. **Start your AI assistant**: Open Claude Desktop (or your MCP client)
3. **Ask questions**: The AI can now interact with Polar

### Example Prompts

**Network Management:**

- "List all my Lightning networks in Polar"
- "Create a new Lightning network called 'test-network' with 2 LND nodes and 1 Taproot Assets node"
- "Start network 1"
- "Stop all running networks"

**Bitcoin Operations:**

- "Mine 10 blocks on network 1"
- "Get the blockchain info for network 1"
- "Send 0.1 BTC from alice to bob on network 1"

**Lightning Channels:**

- "Open a channel from alice to bob with 1,000,000 sats on network 1"
- "Close channel abc123:0 on node alice in network 1"
- "Create a Lightning invoice for 10,000 sats on alice"
- "Pay this Lightning invoice from bob: [invoice string]"

**Taproot Assets:**

- "Mint a new asset called 'TestToken' with 1,000 units on alice-tap"
- "Send 100 units of asset abc123 to bob's Taproot Assets address"
- "Create an asset invoice for 50 units of asset xyz789 on alice"
- "Pay this asset invoice from bob using asset xyz789"

**Complex Tasks:**

- "Create a network with 2 LND nodes and 1 Taproot Assets node, start it, mine 100 blocks, then mint a new asset"
- "Set up a complete Lightning network: create network, fund nodes, open channels, mint assets, and create asset addresses"
- "Show me all networks and their current status including node health and balances"

## Available Tools

The MCP server dynamically discovers 40+ tools from Polar, organized into categories:

- **Network Management** (12 tools): Create, start/stop, rename networks; add/remove/rename nodes
- **Bitcoin Operations** (5 tools): Mine blocks, send transactions, wallet management
- **Lightning Operations** (13 tools): Channels, payments, invoices, node information
- **Taproot Assets** (7 tools): Mint, send, manage assets and addresses
- **Asset Channels** (3 tools): Fund and close asset-enabled channels
- **Asset Payments** (2 tools): Create and pay asset invoices
- **Lightning Terminal** (3 tools): LNC session management

For a complete reference of all available tools with parameters and descriptions, see [TOOLS.md](TOOLS.md).

## Architecture

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────┐
│  AI Client  │ stdio   │  MCP Server     │  HTTP   │  Polar App   │
│  (Claude)   │◄───────►│  (This Package) │◄───────►│  (Electron)  │
└─────────────┘         └─────────────────┘         └──────────────┘
                             Port 37373                   UI Updates
```

- The MCP server communicates with AI clients using stdio (standard input/output)
- It connects to Polar's HTTP bridge on `localhost:37373`
- Polar's Redux store is updated, triggering real-time UI updates

## Troubleshooting

### "Cannot connect to Polar"

**Solution**: Make sure the Polar application is running before starting your AI assistant.

You can verify Polar is running by checking the health endpoint:

```bash
curl http://localhost:37373/health
# Should return: {"status":"ok","service":"polar-mcp-bridge"}
```

### "Port 37373 already in use"

**Solution**: Another application is using port 37373. Close it or restart Polar.

### Tools not appearing in Claude

**Solution**:

1. Restart Claude Desktop completely (quit and relaunch)
2. Check the config file syntax is valid JSON
3. Check Claude's MCP logs (Help → View Logs in Claude Desktop)

## Development

To build from source:

```bash
yarn install
yarn build
```

## Contributing

Contributions are welcome! Please see the main [Polar repository](https://github.com/jamaljsr/polar) for contribution guidelines.

## License

MIT - See [LICENSE](https://github.com/jamaljsr/polar/blob/master/LICENSE) file

## Links

- [Polar Website](https://lightningpolar.com)
- [Polar GitHub](https://github.com/jamaljsr/polar)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)
