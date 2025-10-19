import fs from "fs";
import path from "path";
import sharp from "sharp";

// Configuration: adjust if head is located differently
const SOURCE_DIR = path.resolve("public/pawns");
const DEST_DIR = path.resolve("public/portraits");
const OUTPUT_SIZE = 400; // 400x400

// Heuristic crop settings (assuming head roughly top-center)
// We first read image metadata to get dimensions and then compute crop box.
async function processImage(file: string) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputPath = path.join(DEST_DIR, file.replace(/\.png$/i, ".portrait.png"));

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) {
            console.warn(`Skipping ${file}: unknown dimensions`);
            return;
        }

        // Assume head occupies top ~45% vertically and centered horizontally.
        const cropWidth = Math.min(OUTPUT_SIZE, metadata.width);
        const cropHeight = Math.min(OUTPUT_SIZE, Math.round(metadata.height * 0.45));

        const left = Math.round((metadata.width - cropWidth) / 2);
        const top = 0; // start at very top

        await image
            .extract({ left, top, width: cropWidth, height: cropHeight })
            .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "cover" })
            .toFile(outputPath);

        console.log(`Created portrait: ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

async function main() {
    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.toLowerCase().endsWith(".png"));
    console.log(`Found ${files.length} pawn images.`);

    for (const file of files) {
        await processImage(file);
    }

    console.log("Portrait extraction complete.");
}

main();
