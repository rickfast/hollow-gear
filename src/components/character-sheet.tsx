import {
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Button,
    Select,
    SelectItem,
    Progress,
} from "@heroui/react";
import type { Character, HitPoints } from "@/types";
import { useState, useEffect } from "react";
import { useCharacterViewModel } from "@/model/use-character-view-model";
import { s } from "framer-motion/client";
import type { AbilityScore, CharacterSummary, SavingThrow } from "@/model/character-view-model";
import { PointBar } from "./point-bar";
import { Skills } from "./skills";
import { Inventory } from "./inventory";

interface CharacterSheetProps {
    id: string;
}

// Helper function to calculate ability modifier
function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

// Helper function to format modifier
function formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

type SectionKey = "skills" | "actions" | "inventory" | "spells" | "features" | "mindcraft";

export function CharacterSheet({ id }: CharacterSheetProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionKey>("skills");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { getCharacter } = useCharacterViewModel();
    const { summary, abilityScores, savingThrows, skills } = getCharacter(id)!;

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

                    {/* Hit Points */}
                    <PointBar label="Hit Points" points={summary.hitPoints} />
                    <PointBar label="Heat Points" points={summary.heatPoints} invert={true} />
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
                            <SelectItem key="spells">Spells</SelectItem>
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
                                ).map(([ability, { score, modifier }]) => (
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
                                            {score}
                                        </div>
                                        <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                            {modifier}
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
                                                {modifier}
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
                                            Actions content coming soon...
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="inventory" title="Inventory">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            <Inventory items={getCharacter(id)!.inventory} />
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="spells" title="Spells">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            Spells content coming soon...
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="features" title="Features + Traits">
                                    <div style={{ padding: "1rem" }}>
                                        <p style={{ opacity: 0.7 }}>
                                            Features & Traits content coming soon...
                                        </p>
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
                            <p style={{ opacity: 0.7 }}>Actions content coming soon...</p>
                        )}
                        {activeSection === "inventory" && (
                            <Inventory items={getCharacter(id)!.inventory} />
                        )}
                        {activeSection === "spells" && (
                            <p style={{ opacity: 0.7 }}>Spells content coming soon...</p>
                        )}
                        {activeSection === "features" && (
                            <p style={{ opacity: 0.7 }}>Features & Traits content coming soon...</p>
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
