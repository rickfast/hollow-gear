import { CLASSES, SPECIES } from "@/data";
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";
import { join } from "path";
import { PROMPTS } from "./prompts";
const sharp = require("sharp");
const Smartcrop = require("smartcrop-sharp");

export const generatePawns = async () => {
    const classNames = CLASSES.map((cls) => cls.type);
    const speciesNames = SPECIES.map((species) => species.type);

    // Create output directory if it doesn't exist
    const outputDir = join(process.cwd(), "public", "pawns");
    const portraits = join(process.cwd(), "public", "portraits");

    await Bun.write(join(portraits, ".gitkeep"), "");
    await Bun.write(join(outputDir, ".gitkeep"), "");

    console.log(`Output directory: ${outputDir}`);
    console.log(`Generating ${speciesNames.length * classNames.length} pawns...`);

    const finalPrompt = `
    The image should only include the character and have a completely transparent background. 
    `;
    // Use for loops instead of forEach to properly handle async/await
    for (const species of speciesNames) {
        for (const cls of classNames) {
            const filename = join(outputDir, `${species}-${cls}.png`);
            const prompts = [
                `### System Prompt:`,
                `You are an assistant that generates images for the D&D 5e game "Hollowgear"`,
                `Overview of the Hollowgear universe: "${PROMPTS.overview}"`,
                `This is a description of what the species "${species}" looks like: ${PROMPTS.species[species]}`,
                `This is a description of the class "${cls}": ${PROMPTS.classes[cls]}`,
                finalPrompt,
                `### User Prompt:`,
            ];

            const file = Bun.file(filename);
            if (!(await file.exists())) {
                console.log(`Generating ${species} ${cls}...`);
                try {
                    const result = await generateImage({
                        model: openai.image("gpt-image-1"),
                        prompt: [
                            ...prompts,
                            `Generate an image of a ${species} ${cls}, full body, transparent background`,
                        ].join("\n"),
                    });

                    console.log(`Writing ${filename}`);
                    await Bun.write(filename, result.image.uint8Array);
                    console.log(`✓ Generated ${species} ${cls}`);
                } catch (error) {
                    console.error(`✗ Failed to generate ${species} ${cls}:`, error);
                    return;
                }
            } else {
                console.log(`⊘ Skipping ${species} ${cls} (already exists)`);
            }

            const porttraitFile = Bun.file(join(portraits, `${species}-${cls}.portrait.png`));

            if (await porttraitFile.exists()) {
                console.log(`⊘ Skipping portrait for ${species} ${cls} (already exists)`);
                continue;
            }
            // Use smartcrop to find the best crop for the portrait
            const pawnImage = await Bun.file(filename).arrayBuffer();

            console.log(`Generating portrait for ${species} ${cls}...`);
            const cropResult = await Smartcrop.crop(Buffer.from(pawnImage), {
                width: 240,
                height: 240,
            });

            const { x: left, y: top, width, height } = cropResult.topCrop;

            await sharp(Buffer.from(pawnImage))
                .extract({ left, top, width, height })
                .toFile(join(portraits, `${species}-${cls}.portrait.png`));

            console.log(
                `✓ Generated portrait for ${species} ${cls}: left=${left}, top=${top}, width=${width}, height=${height}`
            );
        }
    }

    console.log("Generation complete!");
};
