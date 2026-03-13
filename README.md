# Sharp Compress MCP Server

$smithery_ignore
This server provides image optimization tools for AI agents.

## Features
- **Smart Routing**: Choice between WebP and PNG based on image content.
- **Deep Compression**: Powered by `sharp` for maximum efficiency.
- **MCP Native**: Plugs directly into Cursor, Antigravity, and Claude Desktop.

## Tools
- `compress_image`: Optimizes an image at a given path.

## Installation

### Using Smithery
```bash
npx -y @smithery/cli install sharp-compress-skill --config "{\"path\":\"/path/to/your/image.png\"}"
```

### Manual Installation
1. Clone the repo.
2. Install dependencies: `bun install`.
3. Configure your MCP client to run: `bun run src/mcp.ts`.
