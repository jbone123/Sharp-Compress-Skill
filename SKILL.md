---
name: sharp-compress-skill
description: High-performance image optimization engine powered by Sharp (libvips). Intelligent WebP/PNG routing.
---

# SharpCompressSkill

> Professional image optimization for AI Agents and Developers.

## 1. Strategy Logic

| Scenario | Tool Strategy | Output Format |
| :--- | :--- | :--- |
| **Normal Photos** | `sharp.webp()` | `.webp` |
| **Logos / Small Icons** | `sharp.png(palette: true)` | `.png` |
| **Large Graphics** | `sharp.webp(quality: 80)` | `.webp` |

**Rules for AI Agents:**
1. **Prefer WebP**: Unless specifically asked for PNG or if the file is a small UI icon (< 100KB).
2. **Auto-Pathing**: Always verify the file exists before calling the compression tool.
3. **Report Savings**: After compression, tell the user exactly how many KBs were saved.

## 2. API Usage (Elysia)

```bash
POST /compress
{
  "path": "/absolute/path/to/image.png",
  "quality": 80
}
```

## 3. CLI Usage

```bash
# Basic compression
bun run src/cli.ts ./images/hero.png

# Custom quality
bun run src/cli.ts ./images/banner.jpg 75
```

## 4. MCP Integration

Add this to your `cursor` or `antigravity` config:
```json
{
  "mcpServers": {
    "sharp-compress": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/Sharp-Compress-Skill/src/mcp.ts"]
    }
  }
}
```
