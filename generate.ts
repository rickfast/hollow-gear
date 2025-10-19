import { generatePawns } from "./src/image/generate-pawns";
import { generatePortraits } from "./src/image/generate-portraits";

console.log("=".repeat(60));
console.log("HOLLOW GEAR 5E - IMAGE GENERATION");
console.log("=".repeat(60));
console.log();

// Step 1: Generate Pawns
console.log("STEP 1: Generating Pawns (Full Body)");
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

// Step 2: Generate Portraits (Cropped Headshots)
console.log("STEP 2: Generating Portraits (400x400 Headshots)");
console.log("Input directory: public/pawns/");
console.log("Output directory: public/portraits/");
console.log();

try {
    await generatePortraits();
    console.log();
    console.log("✓ All portraits generated successfully!");
} catch (error) {
    console.error("✗ Portrait generation failed:", error);
    process.exit(1);
}

console.log();
console.log("=".repeat(60));
console.log();

console.log();
console.log("✓ GENERATION COMPLETE!");
console.log("=".repeat(60));
