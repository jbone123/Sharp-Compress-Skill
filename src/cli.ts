import { compressImage } from "./compressor.js";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const filePath = args[0];
const quality = args[1] ? parseInt(args[1]) : 80;

if (!filePath) {
    console.log("Usage: bun run cli.ts <file_path> [quality]");
    process.exit(1);
}

try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`Error: File not found -> ${fullPath}`);
        process.exit(1);
    }

    console.log(`🖼️  Optimizing: ${filePath}...`);
    const result = await compressImage(fullPath, quality);

    console.log("-----------------------------------------");
    console.log(` ✅ Success!`);
    console.log(` Original: ${(result.originalSize / 1024).toFixed(2)} KB`);
    console.log(` Optimized: ${(result.newSize / 1024).toFixed(2)} KB`);
    console.log(` Savings: ${result.savings}`);
    console.log(` Output: ${result.outputPath}`);
    console.log("-----------------------------------------");
} catch (error) {
    console.error("Fatal error:", error);
}
