import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface CompressionResult {
    originalPath: string;
    outputPath: string;
    originalSize: number;
    newSize: number;
    savings: string;
    format: string;
}

/**
 * Intelligent Image Compression Engine
 * @param inputPath Absolute path to the image
 * @param quality Compression quality (1-100), default 80
 */
export async function compressImage(
    inputPath: string,
    quality = 80
): Promise<CompressionResult> {
    const stats = fs.statSync(inputPath);
    const ext = path.extname(inputPath).toLowerCase();
    const dir = path.dirname(inputPath);
    const filename = path.basename(inputPath, ext);

    // Strategy: 
    // - Default to WebP for maximum savings
    // - If small PNG (likely UI/Icon), keep PNG and perform deep quantization
    let targetExt = '.webp';
    let isPNG = false;

    if (ext === '.png' && stats.size < 100 * 1024) {
        targetExt = '_optimized.png';
        isPNG = true;
    }

    const outputPath = path.join(dir, `${filename}${targetExt}`);
    const pipeline = sharp(inputPath);

    if (isPNG) {
        await pipeline
            .png({
                quality,
                compressionLevel: 9,
                palette: true,
                effort: 10
            })
            .toFile(outputPath);
    } else {
        await pipeline
            .webp({
                quality,
                effort: 6,
                lossless: false
            })
            .toFile(outputPath);
    }

    const newStats = fs.statSync(outputPath);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(2) + '%';

    return {
        originalPath: inputPath,
        outputPath,
        originalSize: stats.size,
        newSize: newStats.size,
        savings,
        format: targetExt.replace('.', '').replace('_optimized', ''),
    };
}
