import { DRONE_TEMPLATES_BY_ID } from "@/data/drones";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import { DroneStorageService } from "@/service/drone-storage-service";
import type { Drone } from "@/types";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    useDisclosure,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const droneStorageService = new DroneStorageService();

export function DronesPage() {
    const navigate = useNavigate();
    const { getAllCharacters, updateCharacter } = useCharacterViewModelContext();
    const [selectedOwnerId, setSelectedOwnerId] = useState<string>("all");
    const [drones, setDrones] = useState<Drone[]>(() => droneStorageService.getAllDrones());
    const [droneToDelete, setDroneToDelete] = useState<Drone | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const characters = getAllCharacters();

    // Filter drones by owner
    const filteredDrones = useMemo(() => {
        if (selectedOwnerId === "all") {
            return drones;
        }
        if (selectedOwnerId === "unassigned") {
            return drones.filter((drone) => !drone.ownerId);
        }
        return drones.filter((drone) => drone.ownerId === selectedOwnerId);
    }, [drones, selectedOwnerId]);

    const handleEdit = (droneId: string) => {
        navigate(`/drones/${droneId}/edit`);
    };

    const handleDeleteClick = (droneId: string) => {
        const drone = drones.find((d) => d.id === droneId);
        if (drone) {
            setDroneToDelete(drone);
            onOpen();
        }
    };

    const handleConfirmDelete = async () => {
        if (!droneToDelete) return;

        try {
            setIsDeleting(true);

            // Simulate async delete for better UX
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Delete the drone from storage
            droneStorageService.deleteDrone(droneToDelete.id);

            // Update character association if the drone had an owner
            if (droneToDelete.ownerId) {
                updateCharacter(droneToDelete.ownerId, (vm) => {
                    const character = vm.toCharacter();
                    return {
                        ...character,
                        drones: character.drones?.filter((d) => d.id !== droneToDelete.id),
                        // Clear activeDroneId if this was the active drone
                        activeDroneId:
                            character.activeDroneId === droneToDelete.id
                                ? undefined
                                : character.activeDroneId,
                    };
                });
            }

            // Refresh the drones list
            setDrones(droneStorageService.getAllDrones());

            // Show success message
            toast.success("Drone deleted successfully", {
                description: `${droneToDelete.name} has been removed.`,
            });

            // Close the modal
            onClose();
            setDroneToDelete(null);
        } catch (error) {
            console.error("Failed to delete drone:", error);
            toast.error("Failed to delete drone", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        onClose();
        setDroneToDelete(null);
    };

    const handleCreateNew = () => {
        navigate("/drones/new");
    };

    // Get owner name for a drone
    const getOwnerName = (ownerId?: string): string => {
        if (!ownerId) return "Unassigned";
        const character = characters.find((c) => c.summary.id === ownerId);
        return character?.summary.name ?? "Unknown";
    };

    // Get drone type display name
    const getDroneTypeName = (templateId: string): string => {
        const template = DRONE_TEMPLATES_BY_ID[templateId];
        return template?.type ?? "Unknown";
    };

    return (
        <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }} className="sm:p-8">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                    gap: "1rem",
                    flexWrap: "wrap",
                }}
            >
                <h1
                    style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}
                    className="sm:text-3xl"
                >
                    Drones
                </h1>
                <Button color="primary" onPress={handleCreateNew} aria-label="Create new drone">
                    <span className="hidden sm:inline">Create New Drone</span>
                    <span className="sm:hidden">Create</span>
                </Button>
            </div>

            {/* Filter by owner */}
            <div style={{ marginBottom: "2rem" }}>
                <Tabs
                    selectedKey={selectedOwnerId}
                    onSelectionChange={(key) => setSelectedOwnerId(key as string)}
                    aria-label="Filter drones by owner"
                >
                    <Tab key="all" title="All Drones" />
                    <Tab key="unassigned" title="Unassigned" />
                    {characters.map((character) => (
                        <Tab key={character.summary.id} title={character.summary.name} />
                    ))}
                </Tabs>
            </div>

            {/* Drones grid */}
            {filteredDrones.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "3rem",
                        opacity: 0.6,
                    }}
                >
                    <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>No drones found</p>
                    <p style={{ fontSize: "0.875rem" }}>
                        {selectedOwnerId === "all"
                            ? "Create your first drone to get started"
                            : "No drones match the selected filter"}
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
                        gap: "1rem",
                    }}
                >
                    {filteredDrones.map((drone) => {
                        const template = DRONE_TEMPLATES_BY_ID[drone.templateId];
                        const ownerName = getOwnerName(drone.ownerId);

                        return (
                            <Card
                                key={drone.id}
                                style={{
                                    transition: "all 0.2s ease",
                                }}
                                className="hover:scale-[1.02] hover:shadow-lg"
                            >
                                <CardBody>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: "1.25rem",
                                                    fontWeight: 600,
                                                    margin: 0,
                                                }}
                                            >
                                                {drone.name}
                                            </h3>
                                            {drone.destroyed && (
                                                <Chip size="sm" color="danger" variant="flat">
                                                    Destroyed
                                                </Chip>
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                marginTop: "0.5rem",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Chip size="sm" variant="flat" color="primary">
                                                {getDroneTypeName(drone.templateId)}
                                            </Chip>
                                            <Chip size="sm" variant="flat">
                                                Level {drone.level}
                                            </Chip>
                                        </div>
                                    </div>

                                    {template && (
                                        <p
                                            style={{
                                                fontSize: "0.875rem",
                                                opacity: 0.7,
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            {template.name}
                                        </p>
                                    )}

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            gap: "0.5rem",
                                            fontSize: "0.875rem",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <div>
                                            <div style={{ opacity: 0.6 }}>HP</div>
                                            <div style={{ fontWeight: 500 }}>
                                                {drone.hitPoints.current}/{drone.hitPoints.maximum}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ opacity: 0.6 }}>Heat</div>
                                            <div style={{ fontWeight: 500 }}>
                                                {drone.heatPoints.current}/
                                                {drone.heatPoints.maximum}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ opacity: 0.6 }}>Mods</div>
                                            <div style={{ fontWeight: 500 }}>
                                                {drone.mods.length}/{drone.modSlots}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "0.875rem",
                                            marginBottom: "1rem",
                                            paddingTop: "0.75rem",
                                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                                        }}
                                    >
                                        <div style={{ opacity: 0.6 }}>Owner</div>
                                        <div style={{ fontWeight: 500 }}>{ownerName}</div>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            marginTop: "auto",
                                        }}
                                    >
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            onPress={() => handleEdit(drone.id)}
                                            style={{ flex: 1 }}
                                            aria-label={`Edit ${drone.name}`}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => handleDeleteClick(drone.id)}
                                            style={{ flex: 1 }}
                                            aria-label={`Delete ${drone.name}`}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={handleCancelDelete}>
                <ModalContent>
                    <ModalHeader>Delete Drone</ModalHeader>
                    <ModalBody>
                        {droneToDelete && (
                            <div>
                                <p style={{ marginBottom: "1rem" }}>
                                    Are you sure you want to delete{" "}
                                    <strong>{droneToDelete.name}</strong>?
                                </p>
                                <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                    This action cannot be undone. The drone will be permanently
                                    removed
                                    {droneToDelete.ownerId &&
                                        " and disassociated from its owner character"}
                                    .
                                </p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={handleCancelDelete} isDisabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleConfirmDelete}
                            isLoading={isDeleting}
                            isDisabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Drone"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
