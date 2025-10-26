import { DroneSummary } from "@/components/drone-summary";
import { DroneTypeSelector } from "@/components/drone-type-selector";
import { DRONE_TEMPLATES_BY_ID } from "@/data/drones";
import { DroneBuilder } from "@/model/drone-builder";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import { DroneStorageService } from "@/service/drone-storage-service";
import type { Drone, DroneType } from "@/types";
import { Breadcrumbs, BreadcrumbItem, Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem, Spinner, Tooltip } from "@heroui/react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type DroneBuilderStep = "basics" | "type" | "owner" | "review";

const droneStorageService = new DroneStorageService();

/**
 * Helper function to delete a drone and update character associations.
 * This should be used whenever deleting a drone to ensure character data stays in sync.
 * 
 * @param droneId - ID of the drone to delete
 * @param updateCharacter - Function to update character data
 * @returns true if drone was deleted, false if not found
 */
export function deleteDroneWithCharacterCleanup(
    droneId: string,
    updateCharacter: (id: string, updater: (vm: any) => any) => void
): boolean {
    const deletedDrone = droneStorageService.deleteDrone(droneId);
    
    if (!deletedDrone) {
        return false;
    }

    // If drone had an owner, remove it from character's drones array
    if (deletedDrone.ownerId) {
        try {
            updateCharacter(deletedDrone.ownerId, (vm) => {
                const character = vm.toCharacter();
                const updatedDrones = (character.drones || []).filter(
                    (d: Drone) => d.id !== droneId
                );
                
                return {
                    ...character,
                    drones: updatedDrones,
                    // Clear activeDroneId if this was the active drone
                    activeDroneId: character.activeDroneId === droneId 
                        ? undefined 
                        : character.activeDroneId,
                };
            });
        } catch (error) {
            console.error("Failed to update character after drone deletion:", error);
            // Drone is already deleted, so we don't re-throw
        }
    }

    return true;
}

export function DroneBuilderPage() {
    const navigate = useNavigate();
    const { id: droneId } = useParams<{ id: string }>();
    const { getAllCharacters, updateCharacter } = useCharacterViewModelContext();

    const isEditMode = !!droneId;
    const [existingDrone, setExistingDrone] = useState<Drone | null>(null);
    const [step, setStep] = useState<DroneBuilderStep>("basics");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [droneType, setDroneType] = useState<DroneType | "">("");
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load existing drone data in edit mode
    useEffect(() => {
        if (isEditMode && droneId) {
            setIsLoading(true);
            // Simulate async loading for better UX
            setTimeout(() => {
                const drone = droneStorageService.getDrone(droneId);
                if (!drone) {
                    setError("Drone not found");
                    toast.error("Drone not found");
                    setIsLoading(false);
                    return;
                }

                setExistingDrone(drone);
                setName(drone.name);
                setDescription(drone.customization?.behavioralQuirk || "");
                
                // Get drone type from template
                const template = DRONE_TEMPLATES_BY_ID[drone.templateId];
                if (template) {
                    setDroneType(template.type);
                }
                
                setOwnerId(drone.ownerId || null);
                setIsLoading(false);
            }, 100);
        }
    }, [isEditMode, droneId]);

    const steps: { key: DroneBuilderStep; label: string }[] = [
        { key: "basics", label: "Basics" },
        { key: "type", label: "Type" },
        { key: "owner", label: "Owner" },
        { key: "review", label: "Review" },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === step);

    const validateCurrentStep = (): boolean => {
        const errors: Record<string, string> = {};
        
        switch (step) {
            case "basics":
                // Validate name
                if (!name.trim()) {
                    errors.name = "Drone name is required";
                } else if (name.trim().length > 50) {
                    errors.name = "Name must be 50 characters or less";
                } else {
                    // Check name uniqueness
                    const allDrones = droneStorageService.getAllDrones();
                    const isDuplicate = allDrones.some(
                        (d) => d.name.toLowerCase() === name.trim().toLowerCase() && 
                               d.id !== droneId
                    );
                    if (isDuplicate) {
                        errors.name = `A drone named "${name}" already exists. Please choose a unique name.`;
                    }
                }
                break;
                
            case "type":
                if (!droneType) {
                    errors.droneType = "Please select a drone type";
                }
                break;
                
            case "owner":
                // Validate drone limit if owner is selected
                if (ownerId && !canAddDrone) {
                    errors.owner = `${selectedOwner?.name} has reached their drone limit (${currentDroneCount}/${droneLimit}). Each Artifex can only have one active drone at a time.`;
                }
                break;
        }
        
        setFieldErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            setError("Please fix the errors before continuing");
            return false;
        }
        
        return true;
    };

    const handleNext = () => {
        setError(null);
        setFieldErrors({});
        
        if (!validateCurrentStep()) {
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        if (currentStepIndex < steps.length - 1) {
            setStep(steps[currentStepIndex + 1]!.key);
            // Scroll to top when changing steps
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setError(null);
        setFieldErrors({});
        if (currentStepIndex > 0) {
            setStep(steps[currentStepIndex - 1]!.key);
            // Scroll to top when changing steps
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCreate = async () => {
        try {
            setIsSaving(true);
            
            // Final validation before creating/updating
            if (!validateCurrentStep()) {
                setIsSaving(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            // Validate name uniqueness one more time
            const allDrones = droneStorageService.getAllDrones();
            const isDuplicate = allDrones.some(
                (d) => d.name.toLowerCase() === name.trim().toLowerCase() && 
                       d.id !== droneId
            );
            if (isDuplicate) {
                setFieldErrors({ name: `A drone named "${name}" already exists. Please choose a unique name.` });
                setError("Please fix the errors before continuing");
                setStep("basics");
                setIsSaving(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            if (isEditMode && existingDrone) {
                // Edit mode: update existing drone
                const previousOwnerId = existingDrone.ownerId;
                
                // Validate drone limit if owner changed and new owner is selected
                if (ownerId && ownerId !== previousOwnerId && !canAddDrone) {
                    setFieldErrors({ owner: `${selectedOwner?.name} has reached their drone limit (${currentDroneCount}/${droneLimit})` });
                    setError(`Cannot assign drone: ${selectedOwner?.name} has reached their drone limit (${currentDroneCount}/${droneLimit})`);
                    setIsSaving(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                // Get template for the drone type
                const template = Object.values(DRONE_TEMPLATES_BY_ID).find((t) => t.type === droneType);
                if (!template) {
                    setFieldErrors({ droneType: "Invalid drone type selected" });
                    setError("Invalid drone type selected");
                    setIsSaving(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                // Create updated drone preserving ID and other properties
                const updatedDrone: Drone = {
                    ...existingDrone,
                    name,
                    templateId: template.id,
                    mods: [], // Drones don't use equipment
                    ownerId: ownerId || undefined,
                    customization: {
                        ...existingDrone.customization,
                        behavioralQuirk: description || undefined,
                    },
                };

                // Simulate async save for better UX
                await new Promise(resolve => setTimeout(resolve, 300));
                
                droneStorageService.updateDrone(existingDrone.id, updatedDrone);

                toast.success("Drone updated successfully", {
                    description: `${updatedDrone.name} has been updated.`,
                });

                // Handle character association changes
                if (previousOwnerId !== ownerId) {
                    // Remove from previous owner
                    if (previousOwnerId) {
                        updateCharacter(previousOwnerId, (vm) => {
                            const character = vm.toCharacter();
                            const updatedDrones = (character.drones || []).filter(
                                (d: Drone) => d.id !== existingDrone.id
                            );
                            
                            return {
                                ...character,
                                drones: updatedDrones,
                                activeDroneId: character.activeDroneId === existingDrone.id 
                                    ? undefined 
                                    : character.activeDroneId,
                            };
                        });
                    }

                    // Add to new owner
                    if (ownerId) {
                        updateCharacter(ownerId, (vm) => {
                            const character = vm.toCharacter();
                            const existingDrones = character.drones || [];
                            
                            return {
                                ...character,
                                drones: [...existingDrones, updatedDrone],
                                activeDroneId: updatedDrone.id,
                            };
                        });
                    }
                } else if (ownerId) {
                    // Same owner, just update the drone in their array
                    updateCharacter(ownerId, (vm) => {
                        const character = vm.toCharacter();
                        const updatedDrones = (character.drones || []).map((d: Drone) =>
                            d.id === existingDrone.id ? updatedDrone : d
                        );
                        
                        return {
                            ...character,
                            drones: updatedDrones,
                        };
                    });
                }

                // Navigate to character sheet if owner is set, otherwise to drones list
                if (ownerId) {
                    navigate(`/characters/${ownerId}`);
                } else {
                    navigate("/drones");
                }
            } else {
                // Create mode: create new drone
                // Validate drone limit if owner is selected
                if (ownerId && !canAddDrone) {
                    setFieldErrors({ owner: `${selectedOwner?.name} has reached their drone limit (${currentDroneCount}/${droneLimit})` });
                    setError(`Cannot add drone: ${selectedOwner?.name} has reached their drone limit (${currentDroneCount}/${droneLimit})`);
                    setIsSaving(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const builder = new DroneBuilder();
                
                // Set validation context for uniqueness checks
                builder.setValidationContext({
                    existingDrones: allDrones,
                });
                
                builder.setName(name).setType(droneType as DroneType).setLevel(1);

                if (description) {
                    builder.setDescription(description);
                }

                if (ownerId) {
                    builder.setOwner(ownerId);
                }

                const drone = builder.build();
                
                // Simulate async save for better UX
                await new Promise(resolve => setTimeout(resolve, 300));
                
                droneStorageService.saveDrone(drone);

                toast.success("Drone created successfully", {
                    description: `${drone.name} is ready for deployment!`,
                });

                // Update character's drones array if owner is set
                if (ownerId) {
                    updateCharacter(ownerId, (vm) => {
                        const character = vm.toCharacter();
                        const existingDrones = character.drones || [];
                        
                        return {
                            ...character,
                            drones: [...existingDrones, drone],
                            activeDroneId: drone.id, // Set as active drone
                        };
                    });
                }

                // Navigate to character sheet if owner is set, otherwise to drones list
                if (ownerId) {
                    navigate(`/characters/${ownerId}`);
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} drone`;
            setError(errorMessage);
            toast.error(errorMessage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSaving(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case "basics":
                return name.trim().length > 0;
            case "type":
                return droneType !== "";
            case "owner":
                return true; // Optional
            case "review":
                return true;
            default:
                return false;
        }
    };

    // Get template for current drone type
    const selectedTemplate = droneType
        ? Object.values(DRONE_TEMPLATES_BY_ID).find((t) => t.type === droneType)
        : null;

    // Get all characters for owner selection
    const allCharacters = getAllCharacters();

    // Filter to Artifex characters only
    const artifexCharacters = allCharacters.filter((vm) =>
        vm.summary.class === "Artifex" || vm.summary.fullClass.includes("Artifex")
    );

    // Get selected owner character
    const selectedOwnerVm = ownerId
        ? allCharacters.find((vm) => vm.summary.id === ownerId)
        : undefined;
    const selectedOwner = selectedOwnerVm?.summary;

    // Calculate drone limit (Artifex can have only 1 active drone at a time)
    const getDroneLimit = () => 1;

    // Get current drone count for selected owner
    const currentDroneCount = selectedOwnerVm?.toCharacter().drones?.length || 0;
    const droneLimit = getDroneLimit();
    const canAddDrone = currentDroneCount < droneLimit;

    return (
        <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }} className="sm:p-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumbs style={{ marginBottom: "1.5rem" }} aria-label="Breadcrumb navigation">
                <BreadcrumbItem>
                    <Link to="/">Characters</Link>
                </BreadcrumbItem>
                {ownerId && selectedOwner && (
                    <BreadcrumbItem>
                        <Link to={`/characters/${ownerId}`}>{selectedOwner.name}</Link>
                    </BreadcrumbItem>
                )}
                <BreadcrumbItem>{isEditMode ? 'Edit Drone' : 'Create Drone'}</BreadcrumbItem>
            </Breadcrumbs>

            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <Spinner size="lg" label="Loading drone data..." />
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: "2rem",
                    }}
                    className="grid-cols-1 lg:grid-cols-[1fr_400px]"
                >
                    {/* Main Content */}
                    <Card>
                    <CardHeader>
                        <div style={{ width: "100%" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
                                {isEditMode ? 'Edit Drone' : 'Create Drone'}
                            </h1>
                            {/* Progress Steps */}
                            <div 
                                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                                role="progressbar"
                                aria-label="Drone creation progress"
                                aria-valuenow={currentStepIndex + 1}
                                aria-valuemin={1}
                                aria-valuemax={steps.length}
                            >
                                {steps.map((s, idx) => (
                                    <Chip
                                        key={s.key}
                                        color={
                                            idx < currentStepIndex
                                                ? "success"
                                                : idx === currentStepIndex
                                                  ? "primary"
                                                  : "default"
                                        }
                                        variant={idx === currentStepIndex ? "solid" : "flat"}
                                        size="sm"
                                        style={{
                                            transition: "all 0.3s ease",
                                        }}
                                        aria-current={idx === currentStepIndex ? "step" : undefined}
                                    >
                                        {idx + 1}. {s.label}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div style={{ minHeight: "400px", padding: "0.5rem" }} className="sm:p-4">
                            {error && (
                                <div
                                    style={{
                                        padding: "1rem",
                                        marginBottom: "1rem",
                                        backgroundColor: "var(--heroui-danger-50)",
                                        borderRadius: "0.5rem",
                                        color: "var(--heroui-danger)",
                                        animation: "fadeIn 0.3s ease",
                                    }}
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Step: Basics */}
                            {step === "basics" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Drone Basics
                                    </h2>
                                    <Input
                                        label="Drone Name"
                                        placeholder="Enter your drone's name"
                                        value={name}
                                        onValueChange={(value) => {
                                            setName(value);
                                            // Clear error when user starts typing
                                            if (fieldErrors.name) {
                                                setFieldErrors({ ...fieldErrors, name: "" });
                                                setError(null);
                                            }
                                        }}
                                        size="lg"
                                        isRequired
                                        isInvalid={!!fieldErrors.name}
                                        errorMessage={fieldErrors.name}
                                        description={!fieldErrors.name ? "Give your drone a unique name (1-50 characters)" : undefined}
                                        aria-label="Drone name"
                                        autoFocus
                                    />
                                    <Input
                                        label="Description (Optional)"
                                        placeholder="Describe your drone's personality or quirks"
                                        value={description}
                                        onValueChange={setDescription}
                                        size="lg"
                                        description="Add a behavioral quirk or description for your drone"
                                        aria-label="Drone description"
                                    />
                                    <div style={{ 
                                        fontSize: "0.875rem", 
                                        opacity: 0.7,
                                        padding: "0.75rem",
                                        backgroundColor: "hsl(var(--heroui-default-100))",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid hsl(var(--heroui-primary))",
                                    }}>
                                        💡 <strong>Tip:</strong> Choose a name that fits your mechanical companion in the
                                        steampunk world of Hollow Gear. Names like "Cogsworth", "Steamwhisker", or "Brassbeard" work well!
                                    </div>
                                </div>
                            )}

                            {/* Step: Type */}
                            {step === "type" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Choose Drone Type
                                    </h2>
                                    {fieldErrors.droneType && (
                                        <div
                                            style={{
                                                padding: "0.75rem",
                                                backgroundColor: "var(--heroui-danger-50)",
                                                borderRadius: "0.5rem",
                                                color: "var(--heroui-danger)",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {fieldErrors.droneType}
                                        </div>
                                    )}
                                    <DroneTypeSelector
                                        selectedType={droneType}
                                        onTypeChange={(type) => {
                                            setDroneType(type);
                                            // Clear error when user selects a type
                                            if (fieldErrors.droneType) {
                                                setFieldErrors({ ...fieldErrors, droneType: "" });
                                                setError(null);
                                            }
                                        }}
                                    />
                                </div>
                            )}



                            {/* Step: Owner */}
                            {step === "owner" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Assign Owner
                                    </h2>
                                    <div style={{ 
                                        fontSize: "0.875rem", 
                                        opacity: 0.7,
                                        padding: "0.75rem",
                                        backgroundColor: "hsl(var(--heroui-default-100))",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid hsl(var(--heroui-primary))",
                                    }}>
                                        💡 <strong>Tip:</strong> Optionally assign this drone to an Artifex character. 
                                        Each Artifex can only have one active drone at a time. You can skip this step and assign an owner later.
                                    </div>

                                    {artifexCharacters.length > 0 ? (
                                        <>
                                            <Select
                                                label="Owner Character"
                                                placeholder="Select an Artifex character (optional)"
                                                selectedKeys={ownerId ? [ownerId] : []}
                                                onSelectionChange={(keys) => {
                                                    const selected = Array.from(keys)[0] as
                                                        | string
                                                        | undefined;
                                                    setOwnerId(selected || null);
                                                    setError(null);
                                                    // Clear error when user changes selection
                                                    if (fieldErrors.owner) {
                                                        setFieldErrors({ ...fieldErrors, owner: "" });
                                                    }
                                                }}
                                                size="lg"
                                                isInvalid={!!fieldErrors.owner}
                                                errorMessage={fieldErrors.owner}
                                                aria-label="Select owner character"
                                            >
                                                {artifexCharacters.map((vm) => {
                                                    const droneCount = vm.toCharacter().drones?.length || 0;
                                                    const atLimit = droneCount >= droneLimit && vm.summary.id !== ownerId;
                                                    return (
                                                        <SelectItem 
                                                            key={vm.summary.id}
                                                            isDisabled={atLimit}
                                                        >
                                                            {vm.summary.name} (Level {vm.summary.level})
                                                            {atLimit && " - Drone limit reached"}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </Select>

                                            {ownerId && !canAddDrone && !fieldErrors.owner && (
                                                <Card style={{ backgroundColor: "var(--heroui-warning-50)" }}>
                                                    <CardBody>
                                                        <p style={{ fontSize: "0.875rem", color: "var(--heroui-warning)" }}>
                                                            ⚠️ This character has reached their drone limit ({currentDroneCount}/{droneLimit}). 
                                                            Each Artifex can only have one active drone at a time. Please select a different character or leave this field empty.
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            )}
                                        </>
                                    ) : (
                                        <Card>
                                            <CardBody>
                                                <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                                    No Artifex characters found. Create an Artifex
                                                    character first to assign this drone to them.
                                                </p>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {selectedOwner && canAddDrone && (
                                        <Card>
                                            <CardBody>
                                                <h3
                                                    style={{
                                                        fontWeight: 600,
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    {selectedOwner.name}
                                                </h3>
                                                <p style={{ fontSize: "0.875rem" }}>
                                                    {selectedOwner.fullClass}
                                                </p>
                                                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", opacity: 0.7 }}>
                                                    Drones: {currentDroneCount}/{droneLimit}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Step: Review */}
                            {step === "review" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Review Drone
                                    </h2>
                                    <Card>
                                        <CardBody>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1rem",
                                                }}
                                            >
                                                <div>
                                                    <strong>Name:</strong> {name}
                                                </div>
                                                {description && (
                                                    <div>
                                                        <strong>Description:</strong> {description}
                                                    </div>
                                                )}
                                                <div>
                                                    <strong>Type:</strong>{" "}
                                                    {selectedTemplate?.name || droneType}
                                                </div>
                                                <div>
                                                    <strong>Level:</strong> 1
                                                </div>
                                                {selectedOwner && (
                                                    <div>
                                                        <strong>Owner:</strong> {selectedOwner.name}
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div style={{ 
                                        fontSize: "0.875rem", 
                                        opacity: 0.7,
                                        padding: "0.75rem",
                                        backgroundColor: "hsl(var(--heroui-success-50))",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid hsl(var(--heroui-success))",
                                    }}>
                                        ✅ <strong>Ready to go!</strong> Review your drone configuration above. 
                                        Click "{isEditMode ? 'Save Changes' : 'Create Drone'}" to finalize your mechanical companion.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "2rem",
                                paddingTop: "1rem",
                                borderTop: "1px solid var(--heroui-divider)",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                variant="flat"
                                onPress={handleBack}
                                isDisabled={currentStepIndex === 0 || isSaving}
                                aria-label="Go to previous step"
                            >
                                Back
                            </Button>
                            {step !== "review" ? (
                                <Tooltip 
                                    content={!canProceed() ? "Complete required fields to continue" : ""}
                                    isDisabled={canProceed()}
                                >
                                    <Button
                                        color="primary"
                                        onPress={handleNext}
                                        isDisabled={!canProceed() || isSaving}
                                        aria-label="Go to next step"
                                    >
                                        Next
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Button 
                                    color="success" 
                                    onPress={handleCreate}
                                    isLoading={isSaving}
                                    isDisabled={isSaving}
                                    aria-label={isEditMode ? 'Save drone changes' : 'Create new drone'}
                                >
                                    {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Drone')}
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>

                    {/* Summary Sidebar - Only visible on large screens */}
                    <div className="hidden lg:block">
                        {selectedTemplate && (
                            <DroneSummary
                                name={name}
                                templateId={selectedTemplate.id}
                                level={1}
                                mods={[]}
                            />
                        )}
                    </div>
                    
                    {/* Mobile Summary - Collapsible at bottom on small screens */}
                    {selectedTemplate && (
                        <div className="lg:hidden mt-4">
                            <Card>
                                <CardBody>
                                    <details>
                                        <summary 
                                            style={{ 
                                                cursor: "pointer", 
                                                fontWeight: 600,
                                                padding: "0.5rem",
                                                userSelect: "none",
                                            }}
                                        >
                                            📋 View Drone Summary
                                        </summary>
                                        <div style={{ marginTop: "1rem" }}>
                                            <DroneSummary
                                                name={name}
                                                templateId={selectedTemplate.id}
                                                level={1}
                                                mods={[]}
                                            />
                                        </div>
                                    </details>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
