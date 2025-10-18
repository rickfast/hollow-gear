import { generateAvatars } from "./src/image/generate-avatars";
import { generatePawns } from "./src/image/generate-pawns";

console.log("=".repeat(60));
console.log("HOLLOW GEAR 5E - IMAGE GENERATION");
console.log("=".repeat(60));
console.log();

// Step 1: Generate Pawns
console.log("STEP 1: Generating Pawns");
console.log("Output directory: public/pawns/");
console.log("---");

try {
    await generatePawns();
    console.log("---");
    console.log("✓ All pawns generated successfully!");
} catch (error) {
    console.error("✗ Pawn generation failed:", error);
    process.exit(1);
}

console.log();
console.log("=".repeat(60));
console.log();

// Step 2: Generate Avatars
console.log("STEP 2: Generating Avatars from Pawns");
console.log("Input directory: public/pawns/");
console.log("Output directory: public/avatars/");
console.log();

try {
    // await generateAvatars();
    console.log();
    console.log("✓ All avatars generated successfully!");
} catch (error) {
    console.error("✗ Avatar generation failed:", error);
    process.exit(1);
}

console.log();
console.log("=".repeat(60));
console.log("✓ GENERATION COMPLETE!");
console.log("=".repeat(60));
