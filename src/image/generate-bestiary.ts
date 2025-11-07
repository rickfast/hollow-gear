import { BESTIARY_CREATURES } from "@/data/bestiary";
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";
import { join } from "path";
import { PROMPTS } from "./prompts";
const sharp = require("sharp");
const Smartcrop = require("smartcrop-sharp");

// Generate AI art pawns & portraits for each bestiary creature.
// Output:
//   - public/monsters/pawns/<id>.png (full body, transparent background)
//   - public/monsters/portraits/<id>.png (cropped avatar)
// Idempotent: skips files that already exist.
export const generateBestiaryPawns = async () => {
    const pawnsDir = join(process.cwd(), "public", "monsters", "pawns");
    const portraitsDir = join(process.cwd(), "public", "monsters", "portraits");

    await Bun.write(join(pawnsDir, ".gitkeep"), "");
    await Bun.write(join(portraitsDir, ".gitkeep"), "");

    console.log(`Output directory (pawns): ${pawnsDir}`);
    console.log(`Output directory (portraits): ${portraitsDir}`);
    console.log(`Generating ${BESTIARY_CREATURES.length} monster pawns...`);

    const stylePrompt = `Art style: hand-drawn, chaotic ink lines, watercolor fills that softly bleed, tactile steampunk fantasy, warm brass + parchment tones with subtle aether glow. Avoid photorealism. Transparent background required.`;

    for (const creature of BESTIARY_CREATURES) {
        const { id, name, type, size, description, emoji } = creature;
        const pawnFilename = join(pawnsDir, `${id}.png`);
        const portraitFilename = join(portraitsDir, `${id}.png`);

        // ---------------- Pawn Generation ----------------
        const pawnFile = Bun.file(pawnFilename);
        if (!(await pawnFile.exists())) {
            console.log(`Generating monster pawn: ${id} (${name})`);
            const promptParts = [
                `### System Prompt`,
                `You generate monster token art for the Hollowgear 5e game.`,
                `World overview: ${PROMPTS.overview}`,
                stylePrompt,
                `### Monster Definition`,
                `Name: ${name}`,
                `ID: ${id}`,
                `Size category: ${size}`,
                `Type: ${type}`,
                emoji ? `Representative emoji: ${emoji}` : "",
                description ? `Description: ${description}` : "",
                `### Rendering Requirements`,
                `Full body view. Dynamic but readable silhouette. Transparent background only (no scenery). Centered composition. Lighting diffuse, warm brass + subtle aetheric glow. Watercolor, ink lines, no photo realism.`,
                `Include distinctive visual features that imply its mechanics but do not add textual labels.`,
                `### User Prompt`,
                `Generate a full-body transparent PNG of the monster '${name}' from Hollowgear.`,
            ].filter(Boolean);

            try {
                const result = await generateImage({
                    model: openai.image("gpt-image-1"),
                    prompt: promptParts.join("\n"),
                });
                await Bun.write(pawnFilename, result.image.uint8Array);
                console.log(`✓ Pawn written: ${pawnFilename}`);
            } catch (err) {
                console.error(`✗ Failed to generate pawn for ${id}:`, err);
                continue; // Skip portrait attempt if pawn fails
            }
        } else {
            console.log(`⊘ Pawn exists, skipping: ${id}`);
        }

        // ---------------- Portrait Generation ----------------
        const portraitFile = Bun.file(portraitFilename);
        if (await portraitFile.exists()) {
            console.log(`⊘ Portrait exists, skipping: ${id}`);
            continue;
        }

        try {
            console.log(`Generating portrait for ${id}...`);
            const pawnBuffer = await Bun.file(pawnFilename).arrayBuffer();
            const cropResult = await Smartcrop.crop(Buffer.from(pawnBuffer), {
                width: 240,
                height: 240,
            });
            const { x: left, y: top, width, height } = cropResult.topCrop;
            await sharp(Buffer.from(pawnBuffer))
                .extract({ left, top, width, height })
                .toFile(portraitFilename);
            console.log(
                `✓ Portrait written: ${portraitFilename} (crop left=${left}, top=${top}, width=${width}, height=${height})`
            );
        } catch (err) {
            console.error(`✗ Failed to generate portrait for ${id}:`, err);
        }
    }

    console.log("Monster pawn & portrait generation complete!");
};

export default generateBestiaryPawns;
