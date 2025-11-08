# Polar MCP Server

Model Context Protocol (MCP) server for [Polar Lightning](https://lightningpolar.com). This server enables AI assistants like Claude to interact with Polar to manage Bitcoin Lightning Network test environments.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard that enables AI assistants to securely connect to external data sources and tools. MCP servers expose capabilities that LLMs can discover and use dynamically.

## Features

- **Dynamic Tool Discovery**: Tools are defined in the Polar app and discovered at runtime, ensuring the MCP server stays compatible with all Polar versions
- **Network Management**: List and create Lightning Network test networks
- **Real-time UI Updates**: Changes made through the MCP server are immediately reflected in the Polar UI

## Prerequisites

- [Polar](https://lightningpolar.com) must be installed and running
- Node.js 18 or higher

## Installation

### Option 1: Using npx (Recommended)

No installation needed! Add this configuration to your MCP client.

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

## Publishing a New Version

### Prerequisites

1. **npm Account**: Ensure you have an npm account with publish access to the `@lightningpolar` organization
2. **Authentication**: Log in to npm:
   ```bash
   npm login
   ```

### Publishing Steps

1. **Ensure all changes are committed**:

   ```bash
   git status  # Should show clean working tree
   ```

2. **Build the package**:

   ```bash
   yarn install
   yarn build
   ```

3. **Test locally** (optional but recommended):

   ```bash
   # Link the package locally
   yarn link

   # Test it works
   polar-mcp --help  # Should run without errors

   # Unlink when done testing
   yarn unlink @lightningpolar/mcp
   ```

4. **Update the version**:

   ```bash
   # For patch releases (bug fixes): 1.0.0 -> 1.0.1
   npm version patch

   # For minor releases (new features): 1.0.0 -> 1.1.0
   npm version minor

   # For major releases (breaking changes): 1.0.0 -> 2.0.0
   npm version major
   ```

   This will:

   - Update `package.json` version
   - Create a git commit with the version
   - Create a git tag

5. **Publish to npm**:

   ```bash
   npm publish --access public
   ```

### Automated Publishing (GitHub Actions)

This package includes automated publishing via GitHub Actions. When you create a new release on GitHub:

1. **Create a GitHub Release**: Go to the [Releases](https://github.com/jamaljsr/polar-mcp/releases) page and create a new release
2. **Tag the Release**: Use a semantic version tag like `v1.0.1`
3. **Publish**: The workflow will automatically build and publish to NPM

### Testing the Published Package

After publishing, test the package:

```bash
# Test with npx (no install)
npx -y @lightningpolar/mcp

# Or install globally and test
yarn global add @lightningpolar/mcp
polar-mcp
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
