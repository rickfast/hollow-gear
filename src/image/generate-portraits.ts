import { readdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

/**
 * Generates 300x300 portrait headshots from pawn images.
 * Takes the top square (width x width) from each pawn and resizes to 300x300.
 */
export const generatePortraits = async () => {
    const pawnsDir = join(process.cwd(), "public", "pawns");
    const portraitsDir = join(process.cwd(), "public", "portraits");

    // Create output directory if it doesn't exist
    await Bun.write(join(portraitsDir, ".gitkeep"), "");

    console.log(`Input directory: ${pawnsDir}`);
    console.log(`Output directory: ${portraitsDir}`);

    // Read all PNG files from pawns directory
    const files = await readdir(pawnsDir);
    const pawnFiles = files.filter((file) => file.endsWith(".png") && file !== ".gitkeep");

    console.log(`Found ${pawnFiles.length} pawn images to process...`);
    console.log("---");

    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (const filename of pawnFiles) {
        const inputPath = join(pawnsDir, filename);
        const outputPath = join(portraitsDir, filename);

        // const outputFile = Bun.file(outputPath);
        // if (await outputFile.exists()) {
        //     console.log(`⊘ Skipping ${filename} (portrait already exists)`);
        //     skipped++;
        //     continue;
        // }

        console.log(`Processing ${filename}...`);

        try {
            // Load the image and get its metadata
            const image = sharp(inputPath);
            const metadata = await image.metadata();

            if (!metadata.width || !metadata.height) {
                throw new Error("Could not read image dimensions");
            }

            const { width, height } = metadata;
            console.log(`  Original size: ${width}x${height}`);

            // Take a square from the top with width = original width, height = original width
            // This gives us the top square portion of the image
            const cropSize = width;
            const cropHeight = Math.min(cropSize, height); // Don't exceed image height

            console.log(`  Extracting top square: ${width}x${cropHeight}`);

            // Extract the top square and resize to 300x300
            await image
                .extract({
                    left: 0,
                    top: 0,
                    width: width,
                    height: cropHeight,
                })
                .resize(300, 300, {
                    fit: "cover", // Crop to fill if needed
                    position: "top", // Keep the top portion
                    kernel: sharp.kernel.lanczos3,
                })
                .png({
                    quality: 100,
                    compressionLevel: 9,
                })
                .toFile(outputPath);

            console.log(`✓ Generated 300x300 portrait for ${filename}`);
            processed++;
        } catch (error) {
            console.error(`✗ Failed to generate portrait for ${filename}:`, error);
            failed++;
        }
    }

    console.log("---");
    console.log(`Portrait generation complete!`);
    console.log(`  Processed: ${processed}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Failed: ${failed}`);
};
