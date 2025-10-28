import { generateDronePawns } from "./src/image/generate-drones";
import { generatePawns } from "./src/image/generate-pawns";
import { generatePortraits } from "./src/image/generate-portraits";

console.log("=".repeat(60));
console.log("HOLLOW GEAR 5E - IMAGE GENERATION");
console.log("=".repeat(60));
console.log();

// Step 1: Generate Character Pawns
console.log("STEP 1: Generating Character Pawns (Full Body)");
console.log("Output directory: public/pawns/");
console.log("---");

try {
    await generatePawns();
    console.log("---");
    console.log("✓ All character pawns generated successfully!");
} catch (error) {
    console.error("✗ Character pawn generation failed:", error);
    process.exit(1);
}

console.log();
console.log("=".repeat(60));
console.log();

// Step 2: Generate Character Portraits (Cropped Headshots)
// console.log("STEP 2: Generating Character Portraits (300x300 Headshots)");
// console.log("Input directory: public/pawns/");
// console.log("Output directory: public/portraits/");
// console.log();

// try {
//     await generatePortraits();
//     console.log();
//     console.log("✓ All character portraits generated successfully!");
// } catch (error) {
//     console.error("✗ Character portrait generation failed:", error);
//     process.exit(1);
// }

console.log();
console.log("=".repeat(60));
console.log();

// Step 3: Generate Drone Pawns and Portraits
console.log("STEP 3: Generating Drone Pawns and Portraits");
console.log("Output directory: public/drones/pawns/");
console.log("Output directory: public/drones/portraits/");
console.log("---");

try {
    await generateDronePawns();
    console.log("---");
    console.log("✓ All drone pawns and portraits generated successfully!");
} catch (error) {
    console.error("✗ Drone generation failed:", error);
    process.exit(1);
}

console.log();
console.log("=".repeat(60));
console.log();

console.log();
console.log("✓ GENERATION COMPLETE!");
console.log("  - Character pawns: public/pawns/");
console.log("  - Character portraits: public/portraits/");
console.log("  - Drone pawns: public/drones/pawns/");
console.log("  - Drone portraits: public/drones/portraits/");
console.log("=".repeat(60));
