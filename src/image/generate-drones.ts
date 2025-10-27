import { DRONE_ARCHETYPES, DRONE_TEMPLATES } from "@/data/drones";
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";
import { join } from "path";
import { PROMPTS } from "./prompts";
const sharp = require("sharp");
const Smartcrop = require("smartcrop-sharp");

export const generateDronePawns = async () => {
    const droneTypes = DRONE_TEMPLATES.map((template) => template.type);
    const droneArchetypes = DRONE_ARCHETYPES.map((archetype) => archetype.archetype);

    // Create output directories
    const outputDir = join(process.cwd(), "public", "drones", "pawns");
    const portraitsDir = join(process.cwd(), "public", "drones", "portraits");

    await Bun.write(join(outputDir, ".gitkeep"), "");
    await Bun.write(join(portraitsDir, ".gitkeep"), "");

    console.log(`Output directory: ${outputDir}`);
    console.log(
        `Generating ${droneTypes.length * droneArchetypes.length} drone pawns...`
    );

    const finalPrompt = `
    The image should only include the drone and have a completely transparent background.
    The drone should be shown in full body view with all mechanical details visible.
    `;

    // Generate drones for each type/archetype combination
    for (const droneType of droneTypes) {
        for (const archetype of droneArchetypes) {
            const filename = join(outputDir, `${droneType}-${archetype}.png`);
            const prompts = [
                `### System Prompt:`,
                `You are an assistant that generates images for the D&D 5e game "Hollowgear"`,
                `Overview of the Hollowgear universe: "${PROMPTS.overview}"`,
                `Drone design philosophy: "${PROMPTS.droneOverview}"`,
                `This is a description of the drone type "${droneType}": ${PROMPTS.droneTypes[droneType]}`,
                `This is a description of the drone archetype "${archetype}": ${PROMPTS.droneArchetypes[archetype]}`,
                `Composition and lighting: "${PROMPTS.lightingAndComposition.drone}"`,
                finalPrompt,
                `### User Prompt:`,
            ];

            const file = Bun.file(filename);
            if (!(await file.exists())) {
                console.log(`Generating ${droneType} ${archetype} drone...`);
                try {
                    const result = await generateImage({
                        model: openai.image("gpt-image-1"),
                        prompt: [
                            ...prompts,
                            `Generate an image of a ${droneType} drone with ${archetype} archetype, full body, transparent background, steampunk mechanical design with glowing aetheric core`,
                        ].join("\n"),
                    });

                    console.log(`Writing ${filename}`);
                    await Bun.write(filename, result.image.uint8Array);
                    console.log(`✓ Generated ${droneType} ${archetype} drone`);
                } catch (error) {
                    console.error(
                        `✗ Failed to generate ${droneType} ${archetype} drone:`,
                        error
                    );
                    return;
                }
            } else {
                console.log(
                    `⊘ Skipping ${droneType} ${archetype} drone (already exists)`
                );
            }

            // Generate portrait using smartcrop
            const portraitFile = Bun.file(
                join(portraitsDir, `${droneType}-${archetype}.portrait.png`)
            );

            if (await portraitFile.exists()) {
                console.log(
                    `⊘ Skipping portrait for ${droneType} ${archetype} drone (already exists)`
                );
                continue;
            }

            // Use smartcrop to find the best crop for the portrait
            const pawnImage = await Bun.file(filename).arrayBuffer();

            console.log(`Generating portrait for ${droneType} ${archetype} drone...`);
            const cropResult = await Smartcrop.crop(Buffer.from(pawnImage), {
                width: 240,
                height: 240,
            });

            const { x: left, y: top, width, height } = cropResult.topCrop;

            await sharp(Buffer.from(pawnImage))
                .extract({ left, top, width, height })
                .toFile(join(portraitsDir, `${droneType}-${archetype}.portrait.png`));

            console.log(
                `✓ Generated portrait for ${droneType} ${archetype} drone: left=${left}, top=${top}, width=${width}, height=${height}`
            );
        }
    }

    console.log("Drone generation complete!");
};
