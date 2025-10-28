import { AbilityScores } from "@/components/ability-scores";
import type { SavingThrow } from "@/model/character-view-model";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import { DroneStorageService } from "@/service/drone-storage-service";
import type { Drone } from "@/types";
import {
    Avatar,
    Button,
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
import { Link, useNavigate } from "react-router-dom";
import { Actions } from "./actions";
import { Drones } from "./drones";
import { Features } from "./features";
import { Inventory } from "./inventory";
import { Mindcraft } from "./mindcraft";
import { Mods } from "./mods";
import { PointBar } from "./point-bar";
import { RollButton } from "./roll-button";
import { Skills } from "./skills";
import { Spells } from "./spells";
import {
    buildReferencePath,
    getClassReferenceTarget,
    getSpeciesReferenceTarget,
} from "@/utils/reference-links";

const droneStorageService = new DroneStorageService();

interface CharacterSheetProps {
    id: string;
}

type SectionKey =
    | "skills"
    | "actions"
    | "inventory"
    | "spells"
    | "features"
    | "mindcraft"
    | "mods"
    | "drones";

export function CharacterSheet({ id }: CharacterSheetProps) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionKey>("skills");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDroneDetailOpen,
        onOpen: onDroneDetailOpen,
        onClose: onDroneDetailClose,
    } = useDisclosure();
    const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
    const [deleteConfirmDroneId, setDeleteConfirmDroneId] = useState<string | null>(null);

    const { getCharacter, updateCharacter } = useCharacterViewModelContext();
    const { summary, abilityScores, savingThrows, skills } = getCharacter(id);

    const classReferencePath = buildReferencePath(getClassReferenceTarget(summary.class));
    const speciesReferencePath = buildReferencePath(getSpeciesReferenceTarget(summary.species));

    const showSpellsTab = getCharacter(id).spellType !== "None";
    const spellType = getCharacter(id).spellType;
    const isArtifex = summary.class === "Artifex" || summary.fullClass.includes("Artifex");
    const showDronesTab = isArtifex;

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

    const handleDroneHitPointsChange = (droneId: string, delta: number) => {
        updateCharacter(id, (vm) => {
            const drone = vm.drones.find((d) => d.id === droneId);
            if (!drone) return vm.toCharacter();
            const newValue = Math.max(
                0,
                Math.min(drone.hitPoints.maximum, drone.hitPoints.current + delta)
            );
            return vm.updateDroneHitPoints(droneId, newValue);
        });
    };

    const handleDroneHeatPointsChange = (droneId: string, delta: number) => {
        updateCharacter(id, (vm) => {
            const drone = vm.drones.find((d) => d.id === droneId);
            if (!drone) return vm.toCharacter();
            const newValue = Math.max(
                0,
                Math.min(drone.heatPoints.maximum, drone.heatPoints.current + delta)
            );
            return vm.updateDroneHeatPoints(droneId, newValue);
        });
    };

    const handleCreateDrone = () => {
        navigate("/drones/new");
    };

    const handleViewDroneDetail = (droneId: string) => {
        setSelectedDroneId(droneId);
        onDroneDetailOpen();
    };

    const handleRemoveDrone = (droneId: string) => {
        setDeleteConfirmDroneId(droneId);
    };

    const confirmRemoveDrone = () => {
        if (!deleteConfirmDroneId) return;

        const deletedDrone = droneStorageService.deleteDrone(deleteConfirmDroneId);

        if (deletedDrone) {
            // Update character's drones array
            updateCharacter(id, (vm) => {
                const character = vm.toCharacter();
                const updatedDrones = (character.drones || []).filter(
                    (d: Drone) => d.id !== deleteConfirmDroneId
                );

                return {
                    ...character,
                    drones: updatedDrones,
                    // Clear activeDroneId if this was the active drone
                    activeDroneId:
                        character.activeDroneId === deleteConfirmDroneId
                            ? undefined
                            : character.activeDroneId,
                };
            });
        }

        setDeleteConfirmDroneId(null);
    };

    const cancelRemoveDrone = () => {
        setDeleteConfirmDroneId(null);
    };

    // Get drone limit (Artifex can have 1 active drone)
    const droneLimit = 1;
    const currentDroneCount = getCharacter(id).drones.length;
    const canAddDrone = currentDroneCount < droneLimit;

    // Get selected drone for detail view
    const selectedDrone = selectedDroneId
        ? getCharacter(id).drones.find((d) => d.id === selectedDroneId)
        : null;

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
                            style={{
                                width: "120px",
                                height: "120px",
                                flexShrink: 0,
                                backgroundColor: "transparent",
                            }}
                        />

                        {/* Character Info */}
                        <div style={{ flex: "1", minWidth: "250px" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                                {summary.name}
                            </h1>
                            <p style={{ fontSize: "1.125rem", margin: "0.5rem 0", opacity: 0.8 }}>
                                Level {summary.level}{" "}
                                <Link
                                    to={speciesReferencePath}
                                    className="text-primary hover:underline font-semibold"
                                >
                                    {summary.species}
                                </Link>{" "}
                                <Link
                                    to={classReferencePath}
                                    className="text-primary hover:underline font-semibold"
                                >
                                    {summary.class}
                                </Link>
                            </p>
                            <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                <Link
                                    to={classReferencePath}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {summary.fullClass}
                                </Link>
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
                            ) : (
                                <></>
                            )}
                            {showDronesTab ? <SelectItem key="drones">Drones</SelectItem> : <></>}
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
                            <AbilityScores abilityScores={abilityScores} />
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
                                {showDronesTab && (
                                    <Tab key="drones" title="Drones">
                                        <div style={{ padding: "1rem" }}>
                                            {/* Drone Management Header */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "1rem",
                                                    flexWrap: "wrap",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <div>
                                                    <h3
                                                        style={{
                                                            fontSize: "1.25rem",
                                                            fontWeight: 600,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        Your Drones
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontSize: "0.875rem",
                                                            opacity: 0.7,
                                                            margin: "0.25rem 0 0 0",
                                                        }}
                                                    >
                                                        {currentDroneCount} / {droneLimit} active
                                                    </p>
                                                </div>
                                                <Button
                                                    color="primary"
                                                    onPress={handleCreateDrone}
                                                    isDisabled={!canAddDrone}
                                                >
                                                    Create Drone
                                                </Button>
                                            </div>

                                            {!canAddDrone && (
                                                <Card
                                                    style={{
                                                        backgroundColor: "var(--heroui-warning-50)",
                                                        marginBottom: "1rem",
                                                    }}
                                                >
                                                    <CardBody>
                                                        <p
                                                            style={{
                                                                fontSize: "0.875rem",
                                                                color: "var(--heroui-warning)",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            ⚠️ You have reached your drone limit.
                                                            Remove a drone to create a new one.
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            )}

                                            <Drones
                                                drones={getCharacter(id).drones}
                                                activeDroneId={
                                                    getCharacter(id).summary.activeDroneId
                                                }
                                                onDroneHitPointsChange={handleDroneHitPointsChange}
                                                onDroneHeatPointsChange={
                                                    handleDroneHeatPointsChange
                                                }
                                                onViewDetail={handleViewDroneDetail}
                                                onRemove={handleRemoveDrone}
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
                                        <Mindcraft powers={getCharacter(id)!.mindcraftPowers} />
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* Drone Detail Modal */}
            <Modal
                isOpen={isDroneDetailOpen}
                onClose={onDroneDetailClose}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Drone Details</h3>
                    </ModalHeader>
                    <ModalBody>
                        {selectedDrone && (
                            <Drones
                                drones={[selectedDrone]}
                                activeDroneId={getCharacter(id).summary.activeDroneId}
                                onDroneHitPointsChange={handleDroneHitPointsChange}
                                onDroneHeatPointsChange={handleDroneHeatPointsChange}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteConfirmDroneId !== null} onClose={cancelRemoveDrone} size="md">
                <ModalContent>
                    <ModalHeader>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Remove Drone</h3>
                    </ModalHeader>
                    <ModalBody>
                        <p style={{ marginBottom: "1rem" }}>
                            Are you sure you want to remove this drone? This action cannot be
                            undone.
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <Button variant="flat" onPress={cancelRemoveDrone}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={confirmRemoveDrone}>
                                Remove Drone
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

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
                            {activeSection === "features"
                                ? "Features + Traits"
                                : activeSection === "drones"
                                  ? "Drones"
                                  : activeSection}
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
                        {showDronesTab && activeSection === "drones" && (
                            <>
                                {/* Drone Management Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "1rem",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: 600,
                                                margin: 0,
                                            }}
                                        >
                                            Your Drones
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "0.875rem",
                                                opacity: 0.7,
                                                margin: "0.25rem 0 0 0",
                                            }}
                                        >
                                            {currentDroneCount} / {droneLimit} active
                                        </p>
                                    </div>
                                    <Button
                                        color="primary"
                                        onPress={handleCreateDrone}
                                        isDisabled={!canAddDrone}
                                    >
                                        Create Drone
                                    </Button>
                                </div>

                                {!canAddDrone && (
                                    <Card
                                        style={{
                                            backgroundColor: "var(--heroui-warning-50)",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <CardBody>
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    color: "var(--heroui-warning)",
                                                    margin: 0,
                                                }}
                                            >
                                                ⚠️ You have reached your drone limit. Remove a drone
                                                to create a new one.
                                            </p>
                                        </CardBody>
                                    </Card>
                                )}

                                <Drones
                                    drones={getCharacter(id).drones}
                                    activeDroneId={getCharacter(id).summary.activeDroneId}
                                    onDroneHitPointsChange={handleDroneHitPointsChange}
                                    onDroneHeatPointsChange={handleDroneHeatPointsChange}
                                    onViewDetail={handleViewDroneDetail}
                                    onRemove={handleRemoveDrone}
                                />
                            </>
                        )}
                        {activeSection === "mindcraft" && (
                            <Mindcraft powers={getCharacter(id)!.mindcraftPowers} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
