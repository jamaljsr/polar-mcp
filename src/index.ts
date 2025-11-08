import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as http from 'http';
import * as https from 'https';

// Polar HTTP Bridge API URL
// This must match the port configured in electron/mcpBridge.ts
// Can be overridden with POLAR_API_PORT environment variable
const POLAR_API_PORT = process.env.POLAR_API_PORT || '37373';
const POLAR_API_URL = `http://localhost:${POLAR_API_PORT}`;

/**
 * Makes an HTTP request to the Polar API
 */
async function makeRequest(method: string, path: string, body?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, POLAR_API_URL);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = client.request(url, options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data ? JSON.parse(data) : {});
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data || res.statusMessage}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', err => {
      if ((err as any).code === 'ECONNREFUSED') {
        reject(
          new Error(
            'Cannot connect to Polar. Please make sure the Polar application is running.',
          ),
        );
      } else {
        reject(err);
      }
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Fetches available tools from the Polar API with retry logic
 */
async function fetchTools(retries = 3, delayMs = 1000): Promise<Tool[]> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await makeRequest('GET', '/api/mcp/tools');
      return response.tools || [];
    } catch (err: any) {
      lastError = err;

      // Don't retry if Polar is not running
      if (err.message.includes('Cannot connect to Polar')) {
        throw err;
      }

      // Retry with exponential backoff
      if (i < retries - 1) {
        console.error(
          `Failed to fetch tools (attempt ${
            i + 1
          }/${retries}), retrying in ${delayMs}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      }
    }
  }

  console.error('Failed to fetch tools from Polar after all retries:', lastError);
  throw lastError || new Error('Failed to fetch tools');
}

/**
 * Executes a tool by sending a request to the Polar API
 */
async function executeTool(name: string, args: any): Promise<any> {
  try {
    const response = await makeRequest('POST', '/api/mcp/execute', {
      tool: name,
      arguments: args,
    });
    return response;
  } catch (err) {
    console.error(`Failed to execute tool ${name}:`, err);
    throw err;
  }
}

/**
 * Main server implementation
 */
async function main() {
  const server = new Server(
    {
      name: 'polar-mcp-server',
      version: '1.0.0',
      description: 'Polar MCP Server',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Cache for tools - will be populated on first request
  let toolsCache: Tool[] | null = null;

  // Handler for listing available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (!toolsCache) {
      toolsCache = await fetchTools();
    }
    return { tools: toolsCache };
  });

  // Handler for executing tools
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params;

    try {
      const result = await executeTool(name, args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool ${name}: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Polar MCP Server running on stdio');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
