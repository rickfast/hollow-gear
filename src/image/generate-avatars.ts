import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage, generateText } from "ai";
import { readdir } from "fs/promises";
import { join } from "path";

export const generateAvatars = async () => {
    const pawnsDir = join(process.cwd(), "public", "pawns");
    const avatarsDir = join(process.cwd(), "public", "avatars");

    // Create output directory if it doesn't exist
    await Bun.write(join(avatarsDir, ".gitkeep"), "");

    console.log(`Input directory: ${pawnsDir}`);
    console.log(`Output directory: ${avatarsDir}`);

    // Read all PNG files from pawns directory
    const files = await readdir(pawnsDir);
    const pawnFiles = files.filter((file) => file.endsWith(".png") && file !== ".gitkeep");

    console.log(`Found ${pawnFiles.length} pawn images to process...`);
    console.log("---");

    for (const filename of pawnFiles) {
        const inputPath = join(pawnsDir, filename);
        const outputPath = join(avatarsDir, filename);

        const outputFile = Bun.file(outputPath);
        if (await outputFile.exists()) {
            console.log(`⊘ Skipping ${filename} (avatar already exists)`);
            continue;
        }

        console.log(`Processing ${filename}...`);

        try {
            // Read the pawn image
            const inputFile = Bun.file(inputPath);
            const imageBuffer = await inputFile.arrayBuffer();
            const base64Image = Buffer.from(imageBuffer).toString("base64");

            // Step 1: Use vision model to analyze the image and create a detailed description
            console.log(`  Analyzing image with vision model...`);
            const { text: description } = await generateText({
                model: openai("gpt-4o"),
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Describe this character in detail, focusing on their facial features, expression, clothing visible from the shoulders up, and the art style. This will be used to generate a portrait-cropped version. Be specific about colors, textures, and artistic techniques used.",
                            },
                            {
                                type: "image",
                                image: base64Image,
                            },
                        ],
                    },
                ],
            });

            console.log(`  Generating portrait avatar...`);
            // Step 2: Generate a new portrait-oriented image based on the description
            const result = await generateImage({
                model: openai.image("gpt-image-1"),
                prompt: `Create a portrait-oriented character avatar (bust shot, head and upper torso only).
                        
Character description: ${description}

Art style requirements:
- Hand-drawn with chaotic, expressive ink lines and watercolor wash fills
- Visible sketch marks, overlapping outlines, and organic brush textures
- Colors softly bleed outside the lines, as if painted on textured paper
- Natural and diffused lighting with subtle warmth
- Avoid smooth digital gradients; favor watercolor irregularities, pooled pigments, and ink shadows
- The portrait should be centered and suitable as a character avatar
- Focus on the face and expression, with shoulders/upper torso visible`,
                size: "1024x1024",
            });

            console.log(`  Writing ${outputPath}`);
            await Bun.write(outputPath, result.image.uint8Array);
            console.log(`✓ Generated avatar for ${filename}`);
        } catch (error) {
            console.error(`✗ Failed to generate avatar for ${filename}:`, error);
        }
    }

    console.log("---");
    console.log("Avatar generation complete!");
};
