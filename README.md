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

---

## 中文说明

Sharp Compress MCP Server 是一个基于 Bun + Sharp 的图片压缩技能，专门为 MCP 客户端（如 Cursor、Claude Desktop 等）设计，用来**智能压缩 PNG/WebP 等图片**。

### 功能特点

- **智能选择格式**：根据图片内容在 WebP / PNG 之间做出更合适的选择，兼顾体积和质量。
- **高效压缩**：使用 `sharp` 库进行有损/无损压缩，尽量在保证视觉效果的前提下减小文件大小。
- **原生 MCP 集成**：通过 MCP 协议暴露为工具，AI 客户端可以直接调用而无需额外 HTTP 服务配置。

### 工具说明

- **`compress_image`**
  - **作用**：根据给定路径压缩图片，并在同目录生成优化后的文件。
  - **输入参数**：
    - `path`：图片的绝对路径（必填），例如 `/Users/you/Pictures/test.png`
    - `quality`：压缩质量，范围 1–100，默认 80（可选）

### 安装与运行

#### 通过 Smithery 安装（推荐）

在支持 Smithery 的环境中，可以直接执行：

```bash
npx -y @smithery/cli install sharp-compress-skill --config "{\"path\":\"/absolute/path/to/your/image.png\"}"
```

安装完成后，在你的 MCP 客户端（如 Cursor / Claude Desktop）中按照指引添加 / 启用该 skill 即可。

#### 本地手动运行

1. 克隆仓库：

```bash
git clone <你的仓库地址>
cd Sharp-Compress-Skill
```

2. 安装依赖（使用 Bun）：

```bash
bun install
```

3. 在 MCP 客户端中配置该 server 的启动命令（或手动启动）：

```bash
bun run src/mcp.ts
```

当看到终端输出 MCP server 正常运行后，就可以在客户端内调用 `compress_image` 工具，对本地图片进行压缩了。

### 架构示意（中文）

整体可以理解为三层：

1. **图像处理层（Sharp / `compressImage`）**
   - 使用 `sharp` 读取、压缩并写回图片，是所有实际“干活”的逻辑所在。
2. **HTTP 服务层（Elysia / `src/index.ts`）**
   - 使用 Elysia 暴露一个 `POST /compress` 接口。
   - 收到请求后，从请求体中取出 `path` 和 `quality`，调用 `compressImage`，再把结果作为 HTTP 响应返回。
3. **MCP 协议层（`src/mcp.ts`）**
   - 使用 `@modelcontextprotocol/sdk` 暴露 MCP 工具 `compress_image`。
   - AI 客户端（如 Cursor、Claude）通过 MCP 协议调用该工具，内部同样是调用同一个 `compressImage` 函数。

可以简单记忆为：

> **MCP / HTTP 都只是“入口”和“壳子”，真正对图片动手的是底层的 Sharp（`compressImage`）。**
