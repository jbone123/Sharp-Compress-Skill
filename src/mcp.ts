import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { compressImage } from "./compressor";
import path from "node:path";

/**
 * Initialize the MCP Server
 */
export const server = new Server(
    {
        name: "sharp-compress-skill",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "compress_image",
                description: "Smartly optimize images (WebP/PNG) to reduce file size for web/UI use. Use absolute paths.",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Absolute path to the image file",
                        },
                        quality: {
                            type: "number",
                            description: "Compression quality (1-100), default 80",
                            default: 80,
                        },
                    },
                    required: ["path"],
                },
            },
        ],
    };
});

// Define handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "compress_image") {
        const { path: imgPath, quality } = request.params.arguments as any;
        try {
            const result = await compressImage(imgPath, quality);
            return {
                content: [
                    {
                        type: "text",
                        text: `✅ Image optimized!\n- Original: ${(result.originalSize / 1024).toFixed(2)} KB\n- Optimized: ${(result.newSize / 1024).toFixed(2)} KB\n- Savings: ${result.savings}\n- Path: ${result.outputPath}`,
                    },
                ],
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `❌ Error: ${error.message}` }],
                isError: true,
            };
        }
    }
    throw new Error(`Tool not found: ${request.params.name}`);
});

/**
 * For Smithery Deploy: Export a sandbox server function for capability scanning.
 */
export function createSandboxServer() {
    return server;
}

/**
 * Main execution
 */
if (import.meta.main) {
    const transport = new StdioServerTransport();
    server.connect(transport).catch(console.error);
    console.error("🖼️ Sharp Compress MCP Server running...");
}
