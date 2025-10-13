import type { AbilityScore, SavingThrow } from "@/model/character-view-model";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import {
    Avatar,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
    Tab,
    Tabs,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Actions } from "./actions";
import { Features } from "./features";
import { Inventory } from "./inventory";
import { Mods } from "./mods";
import { PointBar } from "./point-bar";
import { RollButton } from "./roll-button";
import { Skills } from "./skills";
import { Spells } from "./spells";

interface CharacterSheetProps {
    id: string;
}

type SectionKey = "skills" | "actions" | "inventory" | "spells" | "features" | "mindcraft" | "mods";

export function CharacterSheet({ id }: CharacterSheetProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionKey>("skills");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { getCharacter, updateCharacter } = useCharacterViewModelContext();
    const { summary, abilityScores, savingThrows, skills } = getCharacter(id);

    const showSpellsTab = getCharacter(id).spellType !== "None";
    const spellType = getCharacter(id).spellType;

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleSectionSelect = (section: SectionKey) => {
        setActiveSection(section);
        onOpen();
    };

    // Resource update handlers
    const handleHitPointsChange = (delta: number) => {
        updateCharacter(id, (vm) => {
            const newValue = Math.max(
                0,
                Math.min(vm.summary.hitPoints.maximum, vm.summary.hitPoints.current + delta)
            );
            return vm.updateHitPoints(newValue, vm.summary.hitPoints.temporary);
        });
    };

    const handleHeatPointsChange = (delta: number) => {
        updateCharacter(id, (vm) => {
            const newValue = Math.max(
                0,
                Math.min(vm.summary.heatPoints.maximum, vm.summary.heatPoints.current + delta)
            );
            return vm.updateHeatPoints(newValue);
        });
    };

    const handleAetherFluxChange = (delta: number) => {
        updateCharacter(id, (vm) => {
            if (!vm.summary.aetherFluxPoints) return vm.toCharacter();
            const newValue = Math.max(
                0,
                Math.min(
                    vm.summary.aetherFluxPoints.maximum,
                    vm.summary.aetherFluxPoints.current + delta
                )
            );
            return vm.updateAetherFluxPoints(newValue);
        });
    };

    const handleResonanceChargesChange = (delta: number) => {
        updateCharacter(id, (vm) => {
            if (!vm.summary.resonanceCharges) return vm.toCharacter();
            const newValue = Math.max(
                0,
                Math.min(
                    vm.summary.resonanceCharges.maximum,
                    vm.summary.resonanceCharges.current + delta
                )
            );
            return vm.updateResonanceCharges(newValue);
        });
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header Section */}
            <Card style={{ marginBottom: "1.5rem" }}>
                <CardBody>
                    <div
                        style={{
                            display: "flex",
                            gap: "1.5rem",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Avatar */}
                        <Avatar
                            src={summary.avatarUrl}
                            name={summary.name}
                            size="lg"
                            showFallback
                            style={{ width: "120px", height: "120px", flexShrink: 0 }}
                        />

                        {/* Character Info */}
                        <div style={{ flex: "1", minWidth: "250px" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                                {summary.name}
                            </h1>
                            <p style={{ fontSize: "1.125rem", margin: "0.5rem 0", opacity: 0.8 }}>
                                Level {summary.level} {summary.species} {summary.class}
                            </p>
                            <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                {summary.fullClass}
                            </p>
                            {summary.background && (
                                <Chip size="sm" variant="flat" style={{ marginTop: "0.5rem" }}>
                                    {summary.background}
                                </Chip>
                            )}
                        </div>

                        {/* Combat Stats */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "1rem",
                                minWidth: "250px",
                            }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    ARMOR CLASS
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {summary.armorClass}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    INITIATIVE
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {summary.initiative}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    SPEED
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {summary.speed}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resource Bars */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                            gap: "0.5rem",
                        }}
                    >
                        <PointBar
                            label="Hit Points"
                            points={summary.hitPoints}
                            onIncrement={() => handleHitPointsChange(1)}
                            onDecrement={() => handleHitPointsChange(-1)}
                        />
                        <PointBar
                            label="Heat Points"
                            points={summary.heatPoints}
                            invert={true}
                            onIncrement={() => handleHeatPointsChange(1)}
                            onDecrement={() => handleHeatPointsChange(-1)}
                        />
                        {summary.aetherFluxPoints?.maximum && (
                            <PointBar
                                label="Aether Flux"
                                points={summary.aetherFluxPoints!}
                                onIncrement={() => handleAetherFluxChange(1)}
                                onDecrement={() => handleAetherFluxChange(-1)}
                            />
                        )}
                        {summary.resonanceCharges?.maximum && (
                            <PointBar
                                label="Resonance Charges"
                                points={summary.resonanceCharges!}
                                onIncrement={() => handleResonanceChargesChange(1)}
                                onDecrement={() => handleResonanceChargesChange(-1)}
                            />
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Main Content */}
            <div
                style={{
                    display: isMobile ? "flex" : "grid",
                    flexDirection: isMobile ? "column" : undefined,
                    gridTemplateColumns: isMobile ? undefined : "1fr 2fr",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                }}
            >
                {isMobile && (
                    <>
                        <Select
                            label="Select Section"
                            value={activeSection}
                            onChange={(e) => handleSectionSelect(e.target.value as SectionKey)}
                        >
                            <SelectItem key="Home">Home</SelectItem>
                            <SelectItem key="skills">Skills</SelectItem>
                            <SelectItem key="actions">Actions</SelectItem>
                            <SelectItem key="inventory">Inventory</SelectItem>
                            <SelectItem key="mods">Mods</SelectItem>
                            {showSpellsTab ? (
                                <SelectItem key="spells">{spellType}</SelectItem>
                            ) : null}
                            <SelectItem key="features">Features</SelectItem>
                            <SelectItem key="mindcraft">Mindcraft</SelectItem>
                        </Select>
                    </>
                )}
                {/* Left Column - Ability Scores & Saving Throws */}
                <div
                    style={{
                        display: isMobile ? "grid" : "flex",
                        gridTemplateColumns: !isMobile ? "1fr 1fr" : undefined,
                        flexDirection: "column", //isMobile ? undefined : "column",
                        gap: "1.5rem",
                        width: "100%",
                    }}
                >
                    {/* Ability Scores */}
                    <Card>
                        <CardHeader>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                Ability Scores
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: "1rem",
                                }}
                            >
                                {(
                                    Object.entries(abilityScores) as [
                                        keyof typeof abilityScores,
                                        AbilityScore,
                                    ][]
                                ).map(([ability, value]) => (
                                    <div
                                        key={ability}
                                        style={{
                                            textAlign: "center",
                                            padding: "0.75rem",
                                            border: "2px solid rgba(0,0,0,0.1)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            {ability.substring(0, 3)}
                                        </div>
                                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                                            {value.score}
                                        </div>
                                        <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                            {value.modifierDisplay}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Saving Throws */}
                    <Card>
                        <CardHeader>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                Saving Throws
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div
                                style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
                            >
                                {(
                                    Object.entries(savingThrows) as [
                                        keyof typeof abilityScores,
                                        SavingThrow,
                                    ][]
                                ).map(([ability, { proficient, modifier }]) => {
                                    return (
                                        <div
                                            key={ability}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "0.5rem",
                                                background: proficient
                                                    ? "rgba(0,0,0,0.05)"
                                                    : "transparent",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.875rem",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {proficient && "● "}
                                                {ability}
                                            </span>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                                <RollButton
                                                    title={`${ability.substring(0, 3).toUpperCase()} Save`}
                                                    rollables={[savingThrows[ability].rollable]}
                                                >
                                                    {modifier}
                                                </RollButton>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Navigation */}
                {isMobile || (
                    <Card>
                        <CardBody>
                            <Tabs aria-label="Character sections" variant="underlined" size="lg">
                                <Tab key="skills" title="Skills">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            <Skills skills={skills} />
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="actions" title="Actions">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            <Actions actions={getCharacter(id).actions} />
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="inventory" title="Inventory">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            <Inventory
                                                inventory={getCharacter(id).inventory}
                                                characterId={id}
                                            />
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="mods" title="Mods">
                                    <div style={{ padding: "1rem" }}>
                                        <Mods inventory={getCharacter(id).inventory} />
                                    </div>
                                </Tab>
                                {showSpellsTab && (
                                    <Tab key="spells" title={spellType}>
                                        <div style={{ padding: "1rem" }}>
                                            <Spells
                                                resourceType={
                                                    spellType === "Formulae"
                                                        ? "Aether Flux"
                                                        : "Resonance Charges"
                                                }
                                                spells={getCharacter(id).spells}
                                            />
                                        </div>
                                    </Tab>
                                )}
                                <Tab key="features" title="Features + Traits">
                                    <div style={{ padding: "1rem" }}>
                                        <Features features={getCharacter(id).features} />
                                    </div>
                                </Tab>
                                <Tab key="mindcraft" title="Mindcraft">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            Mindcraft content coming soon...
                                        </p>
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* Mobile Modal for Section Content */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setActiveSection("skills");
                }}
                size="full"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        <h3
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                textTransform: "capitalize",
                            }}
                        >
                            {activeSection === "features" ? "Features + Traits" : activeSection}
                        </h3>
                    </ModalHeader>
                    <ModalBody>
                        {activeSection === "skills" && (
                            <p style={{ opacity: 0.7 }}>
                                <Skills skills={skills} />
                            </p>
                        )}
                        {activeSection === "actions" && (
                            <Actions actions={getCharacter(id).actions} />
                        )}
                        {activeSection === "inventory" && (
                            <Inventory inventory={getCharacter(id).inventory} characterId={id} />
                        )}
                        {showSpellsTab && activeSection === "spells" && (
                            <Spells
                                resourceType={
                                    spellType === "Formulae" ? "Aether Flux" : "Resonance Charges"
                                }
                                spells={getCharacter(id).spells}
                            />
                        )}
                        {activeSection === "features" && (
                            <Features features={getCharacter(id).features} />
                        )}
                        {activeSection === "mods" && (
                            <Mods inventory={getCharacter(id).inventory} />
                        )}
                        {activeSection === "mindcraft" && (
                            <p style={{ opacity: 0.7 }}>Mindcraft content coming soon...</p>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
