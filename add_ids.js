const fs = require("fs");

const filePath = "./src/data/equipment.ts";
let content = fs.readFileSync(filePath, "utf8");

// Function to convert name to kebab-case ID
function toKebabCase(name) {
    return name.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

// Items that need IDs with their array names
const itemsToAdd = {
    // Remaining weapons
    Volleygun: "Weapon",
    "Aether Cannon": "Weapon",

    // All Armor
    "Steamweave Vest": "Armor",
    "Wireweave Jacket": "Armor",
    "Aetherweave Coat": "Armor",
    "Gearmail Hauberk": "Armor",
    "Steamjack Coat": "Armor",
    "Aetherplate Hauberk": "Armor",
    "Rivetmail Plate": "Armor",
    "Cog Knight Armor": "Armor",
    "Powered Exo-Suit": "Armor",

    // All Shields
    "Standard Shield": "Shield",
    "Steam Shield": "Shield",
    "Resonant Aegis": "Shield",
    "Voltaic Shield": "Shield",
    "Living Steel Shield": "Shield",

    // All Basic Equipment
    "Tinker's Tools": "Equipment",
    "Mechanist's Satchel": "Equipment",
    "Steam Lantern": "Equipment",
    "Aether Compass": "Equipment",
    "Wireweave Rope (50 ft)": "Equipment",
    "Coolant Flask": "Equipment",
    "Pressure Tent": "Equipment",
    "Repair Paste (vial)": "Equipment",
    "Aether Dust Vial": "Equipment",
    "Chronometer Cog": "Equipment",
    "Aether Lamp": "Equipment",
    "Steam Vent Harness": "Equipment",
    "Goggles of Clarity": "Equipment",

    // All Arcane Items
    "Aether Cell": "Equipment",
    "Cloak of Conductivity": "Equipment",
    "Brass Familiar": "Equipment",
    "Magnetron Gauntlet": "Equipment",
    "Cogsmith's Ring": "Equipment",
    "Mnemonic Lens": "Equipment",
    "Wand of Residual Charge": "Equipment",
    "Aether Spire Shard": "Equipment",
    "Steamheart Core": "Equipment",
    "Voltaic Cloak": "Equipment",
    "Chrono Regulator": "Equipment",
    "Resonant Helm": "Equipment",
    "Soul Mirror Pendant": "Equipment",
    "Aether-Linked Gloves": "Equipment",

    // All Mods
    "Overclock Coil": "Mod",
    "Steam Vent Array": "Mod",
    "Voltaic Mesh": "Mod",
    "Resonant Core": "Mod",
    "Magnetron Housing": "Mod",
    "Aether Injector": "Mod",
    "Cryo Edge": "Mod",
    "Entropy Lattice": "Mod",
    "Soul Capacitor": "Mod",
    "Pressure Vents": "Mod",
    "Reinforced Plating": "Mod",
    "Reflective Sigil": "Mod",
    "Flux Dampener": "Mod",
    "Servo Stabilizers": "Mod",
    "Overheat Regulator": "Mod",
    "Aether Amplifier": "Mod",
    "Graviton Anchor": "Mod",
    "Soul Mirror": "Mod",
    "Steam Deflector": "Mod",
    "Resonant Aegis Core": "Mod",
    "Aether Ward Lens": "Mod",
    "Voltaic Pulse Coil": "Mod",
    "Kinetic Redirector": "Mod",
};

for (const [name, type] of Object.entries(itemsToAdd)) {
    const id = toKebabCase(name) + "-001";
    const namePattern = `name: "${name}"`;

    // Find and replace: add id field after name
    const regex = new RegExp(`(\\{\\s*\\n\\s*)name: "${name.replace(/[()]/g, "\\$&")}"`, "g");
    const replacement = `$1id: "${id}",\n        name: "${name}"`;
    content = content.replace(regex, replacement);
}

fs.writeFileSync(filePath, content, "utf8");
console.log("IDs added successfully!");
