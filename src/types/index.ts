// ============================================================================
// CORE CHARACTER TYPE
// ============================================================================

export interface Character {
    avatarUrl?: string;
    id: string; // unique identifier
    name: string;
    species: SpeciesType;
    classes: CharacterClass[];
    level: number; // derived from classes

    // Core Ability Scores
    abilityScores: AbilityScores;

    // Resources
    hitPoints: HitPoints;
    heatPoints: {
        current: number;
        maximum: number; // normally 10
    };

    skills: Skills;

    // Equipment & Inventory
    inventory: InventoryItem[];
    mods: InventoryMod[];
    currency: Currency;

    // Magic & Psionics
    spells: string[];
    spellSlots?: SpellSlots; // For Arcanist/Templar
    aetherFluxPoints?: AetherFluxPoints; // For Mindweaver/Arcanist
    resonanceCharges?: ResonanceCharges; // For Templar
    mindcraftPowers: MindcraftPower[];

    // Combat Stats
    armorClass: number;
    initiative: number;
    speed: number;

    // Proficiencies & Skills
    proficiencies?: Proficiencies;
    languages: Language[];

    // Status Effects
    heatStressLevel: number; // 0-4
    exhaustionLevel: number;
    conditions: Condition[];

    // Background & Personality
    background?: string;
    traits?: string[];
    ideals?: string[];
    bonds?: string[];
    flaws?: string[];
}

export type ActionType = "Action" | "Bonus Action" | "Reaction";
export type Die = 1 | 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface Rollable {
    count: number; // number of dice
    die: Die; // type of die (e.g., d6, d20)
    bonus?: number; // flat bonus to add
}

export interface HitPoints extends Points {
    current: number;
    maximum: number;
    temporary?: number;
}

// ============================================================================
// ABILITY SCORES
// ============================================================================

export interface AbilityScores {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

// ============================================================================
// SPECIES (Chapter 2)
// ============================================================================

export type SpeciesType =
    | "Aqualoth" // Axolotl
    | "Vulmir" // Fox
    | "Rendai" // Red Panda
    | "Karnathi" // Ibex
    | "Tharn" // Elk
    | "Skellin" // Gecko
    | "Avenar"; // Avian

export interface Species {
    type: SpeciesType;
    abilityScoreIncrease: Partial<AbilityScores>;
    speed: number;
    swimSpeed?: number;
    climbSpeed?: number;
    traits: SpeciesTrait[];
    languages: Language[];
}

export interface Feature {
    name: string;
    description: string;
    usesPerRest?: {
        amount: number;
        restType: "short" | "long";
    };
}

export interface SpeciesTrait extends Feature {}

// ============================================================================
// CLASSES (Chapter 3)
// ============================================================================

export interface CharacterClass {
    level: number;
    class: ClassType;
    subclass?: SubclassType;
}

export type ClassType =
    | "Arcanist" // Scholar, Aether manipulator
    | "Templar" // Psionic paladin
    | "Tweaker" // Brawler, flesh modder
    | "Shadehand" // Rogue, infiltrator
    | "Vanguard" // Frontline fighter
    | "Artifex" // Inventor, engineer
    | "Mindweaver"; // Psionic master

export type ClassDescription = {
    role: string;
    description: string;
    archetypes: string[];
};

export interface Class {
    type: ClassType;
    primaryAbility: keyof AbilityScores;
    hitDie: string;
    primaryResource: ResourceType;
    spellcasting?: SpellcastingInfo;
    description: ClassDescription;
    proficiencies?: Proficiencies;
    features: ClassFeature[];
    subclasses: Subclass[];
}

export type ResourceType =
    | "SpellSlots"
    | "AetherFluxPoints"
    | "ResonanceCharges"
    | "AdrenalSurges"
    | "None";

export interface SpellcastingInfo {
    spellcastingAbility: keyof AbilityScores;
    spellLists: string[]; // e.g., ["Wizard", "Warlock"]
    cantripsKnown?: number;
    spellsKnown?: number;
    spellsPrepared?: number;
}

export type SubclassType =
    // Arcanist
    | "Aethermancer"
    | "Gearwright"
    // Templar
    | "Relic Knight"
    | "Iron Saint"
    | "Voice of the Choir"
    // Tweaker
    | "Boilerheart"
    | "Neurospike"
    // Shadehand
    | "Circuitbreaker"
    | "Mirage Operative"
    // Vanguard
    | "Bulwark Sentinel"
    | "Shockbreaker"
    // Artifex
    | "Fieldwright"
    | "Aetherforger"
    // Mindweaver
    | string;

export interface Subclass {
    type: SubclassType;
    features: ClassFeature[];
}

export interface ClassFeature extends Feature {
    level: number;
    damage?: DamageInfo; // for features that deal damage
}

// ============================================================================
// RESOURCES (Chapters 9, 11)
// ============================================================================

export interface Points {
    current: number;
    maximum: number;
}

export interface AetherFluxPoints extends Points {
    current: number;
    maximum: number; // Class Level + Ability Modifier
    rechargeRate: {
        shortRest: number; // usually half
        longRest: number; // usually all
    };
}

export interface ResonanceCharges extends Points {
    current: number;
    maximum: number; // Templar Level + Wisdom modifier
    rechargeRate: {
        shortRest: number; // usually half
        longRest: number; // usually all
    };
}

export interface SpellSlots {
    level1: { current: number; maximum: number };
    level2: { current: number; maximum: number };
    level3: { current: number; maximum: number };
    level4: { current: number; maximum: number };
    level5: { current: number; maximum: number };
    level6: { current: number; maximum: number };
    level7: { current: number; maximum: number };
    level8: { current: number; maximum: number };
    level9: { current: number; maximum: number };
}

// ============================================================================
// EQUIPMENT (Chapter 4)
// ============================================================================

export interface InventoryItem {
    id: string;
    equipmentId: string;
    mods: string[];
    equipped: boolean;
}

export interface InventoryMod {
    id: string;
    modId: string;
    equipped: boolean;
}

export interface Equipment {
    id: string;
    name: string;
    type: EquipmentType;
    tier: CraftTier;
    cost: number; // in Cogs
    weight: number; // in lbs
    description?: string;
}

export type EquipmentType =
    | "Weapon"
    | "Armor"
    | "Shield"
    | "Tool"
    | "Item"
    | "Consumable"
    | "AetherCell"
    | "Focus";

export type CraftTier = "Workshop" | "Guild" | "Relic" | "Mythic";

export interface Weapon extends Equipment {
    type: "Weapon";
    weaponType: WeaponType;
    damage: DamageInfo;
    additionalDamage?: DamageInfo[];
    properties: WeaponProperty[];
    range?: { normal: number; max: number };
    ammoType?: AmmoType;
    powered?: boolean; // requires Aether Cells
}

export type WeaponType =
    | "Melee Simple"
    | "Melee Martial"
    | "Ranged Simple"
    | "Ranged Martial"
    | "Heavy";

export interface DamageInfo extends Rollable {
    damageType: DamageType;
}

export type DamageType =
    | "Slashing"
    | "Piercing"
    | "Bludgeoning"
    | "Fire"
    | "Cold"
    | "Lightning"
    | "Thunder"
    | "Acid"
    | "Poison"
    | "Necrotic"
    | "Radiant"
    | "Force"
    | "Psychic";

export type WeaponProperty =
    | "Light"
    | "Finesse"
    | "Versatile"
    | "Two-Handed"
    | "Thrown"
    | "Reach"
    | "Reload"
    | "Powered"
    | "Burst"
    | "Silent"
    | "Heavy";

export type AmmoType = "Slugs" | "Rivets" | "Bolts" | "AetherCells" | "AetherCore" | "Pellets";

export interface Armor extends Equipment {
    type: "Armor";
    armorType: ArmorType;
    armorClass: number | string; // e.g., "13 + Dex" or 16
    strengthRequirement?: number;
    stealthDisadvantage: boolean;
    powered?: boolean;
}

export type ArmorType = "Light" | "Medium" | "Heavy";

export interface Shield extends Equipment {
    type: "Shield";
    armorClassBonus: number;
}

// ============================================================================
// MODS (Chapter 5)
// ============================================================================

export interface ModSlot {
    tier: ModTier;
    mod?: Mod;
    empty: boolean;
}

export type ModTier = "I - Common" | "II - Advanced" | "III - Relic" | "IV - Prototype";

export interface ModTierSpec {
    tier: ModTier;
    craftTier: CraftTier;
    craftDC: number;
    timeHours: number;
    cost: number; // in Cogs
    powerLevel: string;
    slots: number; // number of mod slots of this tier
}

export type EffectType = "Hit Bonus" | "Damage Bonus" | "Heal";

export interface Effect {
    type: EffectType;
    value?: number; // flat bonus
    duration: "Instant" | "Round" | "Minute" | "Hour" | "UntilRest" | "Permanent";
    rollable?: Rollable;
}

export interface Mod {
    id: string;
    name: string;
    tier: ModTier;
    modType: ModType;
    effect: string;
    craftDC: number;
    craftTime: number; // in hours
    cost: number; // in Cogs
    malfunctionChance?: number;
    notes?: string;
    additionalDamage?: DamageInfo;
}

export type ModType =
    | "Power" // Damage/output enhancement
    | "Utility" // Functional/utility
    | "Reactive" // Triggered effects
    | "Psionic" // Aether-based
    | "Elemental" // Element-specific
    | "Defense"; // Protective

export interface MalfunctionResult {
    roll: number;
    effect: string;
    severity: "Minor" | "Major" | "Critical";
}

// ============================================================================
// SPELLS (Chapter 11)
// ============================================================================

export interface Spell {
    name: string;
    level: number; // 0-9 (0 = cantrip)
    school: SpellSchool;
    type: SpellEffect;
    castingTime: string;
    range: string;
    components: {
        verbal: boolean;
        somatic: boolean;
        material: boolean;
        materials?: string;
    };
    duration: string;
    concentration: boolean;

    // Hollowgear-specific
    aetherCost?: number; // AFP/RC cost
    hollowgearName?: string; // e.g., "Arc Pulse Array" for Magic Missile
    overclockable: boolean;
    heatGenerated?: number;

    savingThrow?: {
        ability: keyof AbilityScores;
        dc: number;
    };
    damage?: DamageInfo; // for spells that deal damage

    description: string;
    higherLevels?: string;
}

export type SpellEffect =
    | "Attack"
    | "Save"
    | "Automatic Hit"
    | "Heal"
    | "Buff"
    | "Movement"
    | "Utility";

export type SpellSchool =
    | "Abjuration"
    | "Conjuration"
    | "Divination"
    | "Enchantment"
    | "Evocation"
    | "Illusion"
    | "Necromancy"
    | "Transmutation";

export interface SpellcastingMethod {
    type: "Arcanist" | "Templar";
    spellLists: string[];
    resourceType: "AetherFluxPoints" | "ResonanceCharges";
    overclockMechanic: string;
    focusType: string;
}

// ============================================================================
// MINDCRAFT / PSIONICS (Chapter 6)
// ============================================================================

export interface MindcraftPower {
    name: string;
    tier: number; // 1-5
    discipline: PsionicDiscipline;
    afpCost: number;
    range?: string;
    duration?: string;
    concentration?: boolean;
    savingThrow?: {
        ability: keyof AbilityScores;
        dc: number;
    };
    effect: string;
    amplifiable: boolean; // Can spend extra AFP to enhance
}

export type PsionicDiscipline =
    | "Flux" // Entropy & Energy
    | "Echo" // Sound, Vibration, Resonance
    | "Eidolon" // Soul Projection
    | "Empyric" // Emotion, Mind, Memory
    | "Veil" // Illusion, Concealment
    | "Kinesis"; // Telekinetic Force

export interface PsionicFeedback {
    roll: number;
    effect: string;
    damage?: DamageInfo;
}

export interface FocusLimit {
    maximum: number; // Number of effects you can sustain
    active: MindcraftPower[];
}

// ============================================================================
// COMBAT & HEAT (Chapter 7)
// ============================================================================

export interface HeatTracking {
    current: number;
    maximum: number;
    stressLevel: number; // 0-4
    sources: HeatSource[];
}

export interface HeatSource {
    source: string;
    amount: number;
    timestamp?: Date;
}

export type OverheatResult = {
    roll: number;
    effect: string;
    damage?: DamageInfo;
};

export interface CombatAction {
    type: CombatActionType;
    name: string;
    description: string;
    heatCost?: number;
    resourceCost?: {
        type: ResourceType;
        amount: number;
    };
}

export type CombatActionType =
    | "Action"
    | "BonusAction"
    | "Reaction"
    | "Overclock"
    | "VentSteam"
    | "StabilizeMod"
    | "ChannelPsionics"
    | "CalibrateArmor";

// ============================================================================
// CURRENCY (Chapter 4)
// ============================================================================

export interface Currency {
    cogs: number; // 1 Cog = base unit
    gears: number; // 1 Gear = 10 Cogs
    cores: number; // 1 Core = 100 Cogs
    aetherDust?: number; // ~25 Cogs per vial
}

// ============================================================================
// LANGUAGES (Chapter 10)
// ============================================================================

export type Language =
    | "Common Geartrade"
    | "Old Tongue"
    | "Guild Cant"
    | "Undertrade"
    | "Skycant"
    | "Rustspeech"
    | "Aetheric" // Telepathic
    | "Aquan"
    | "Sylvan"
    | "Guilder's Cant";

// ============================================================================
// PROFICIENCIES
// ============================================================================

export interface Proficiencies {
    armor: ArmorType[];
    weapons: WeaponType[];
    tools: Tool[];
    savingThrows: (keyof AbilityScores)[];
    skills: SkillType[];
}

export type Tool =
    | "Tinker's Tools"
    | "Thieves' Tools"
    | "Disguise Kit"
    | "Navigator's Tools"
    | "Smith's Tools"
    | "Alchemist's Supplies";

export type SkillType =
    | "Acrobatics"
    | "Animal Handling"
    | "Arcana"
    | "Athletics"
    | "Deception"
    | "History"
    | "Insight"
    | "Intimidation"
    | "Investigation"
    | "Medicine"
    | "Nature"
    | "Perception"
    | "Performance"
    | "Persuasion"
    | "Religion"
    | "Sleight of Hand"
    | "Stealth"
    | "Survival"
    | "Tinkering"; // Hollowgear-specific

export interface Skill {
    modifier: number;
    proficient: boolean;
    expertise: boolean;
}

export interface Skills {
    Acrobatics: Skill;
    "Animal Handling": Skill;
    Arcana: Skill;
    Athletics: Skill;
    Deception: Skill;
    History: Skill;
    Insight: Skill;
    Intimidation: Skill;
    Investigation: Skill;
    Medicine: Skill;
    Nature: Skill;
    Perception: Skill;
    Performance: Skill;
    Persuasion: Skill;
    Religion: Skill;
    "Sleight of Hand": Skill;
    Stealth: Skill;
    Survival: Skill;
    Tinkering: Skill;
}

// ============================================================================
// CONDITIONS & STATUS EFFECTS
// ============================================================================

export type Condition =
    | "Blinded"
    | "Charmed"
    | "Deafened"
    | "Frightened"
    | "Grappled"
    | "Incapacitated"
    | "Invisible"
    | "Paralyzed"
    | "Petrified"
    | "Poisoned"
    | "Prone"
    | "Restrained"
    | "Stunned"
    | "Unconscious"
    | "Overheated"
    | "HeatStressed" // Hollowgear-specific
    | "PsionicFeedback";

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface RestEvent {
    type: "short" | "long";
    timestamp: Date;
    resourcesRestored: {
        hitPoints?: number;
        heatPoints?: number;
        spellSlots?: Partial<SpellSlots>;
        aetherFluxPoints?: number;
        resonanceCharges?: number;
    };
}

export interface LevelUpEvent {
    newLevel: number;
    classType: ClassType;
    hitPointIncrease: number;
    featuresGained: ClassFeature[];
    timestamp: Date;
}
