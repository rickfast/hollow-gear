import type { CharacterVersion } from "@/service/character-storage-service";
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
} from "@heroui/react";
import { useState } from "react";

interface VersionHistoryProps {
    characterId: string;
    versions: CharacterVersion[];
    currentVersion: number;
    onRestore: (version: number) => void;
}

export function VersionHistory({ versions, currentVersion, onRestore }: VersionHistoryProps) {
    const [restoreVersion, setRestoreVersion] = useState<number | null>(null);

    const handleRestoreClick = (version: number) => {
        setRestoreVersion(version);
    };

    const handleConfirmRestore = () => {
        if (restoreVersion !== null) {
            onRestore(restoreVersion);
            setRestoreVersion(null);
        }
    };

    const handleCancelRestore = () => {
        setRestoreVersion(null);
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Sort versions in descending order (newest first)
    const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {sortedVersions.length === 0 ? (
                    <Card>
                        <CardBody>
                            <p style={{ opacity: 0.7, textAlign: "center", margin: 0 }}>
                                No version history available
                            </p>
                        </CardBody>
                    </Card>
                ) : (
                    sortedVersions.map((version) => {
                        const isCurrent = version.version === currentVersion;
                        return (
                            <Card
                                key={version.version}
                                style={{
                                    backgroundColor: isCurrent
                                        ? "rgba(var(--heroui-primary-rgb), 0.1)"
                                        : undefined,
                                }}
                            >
                                <CardBody>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: "1rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    marginBottom: "0.25rem",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "1rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Version {version.version}
                                                </span>
                                                {isCurrent && (
                                                    <Chip size="sm" color="primary" variant="flat">
                                                        Current
                                                    </Chip>
                                                )}
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    opacity: 0.7,
                                                    margin: "0.25rem 0",
                                                }}
                                            >
                                                {formatTimestamp(version.timestamp)}
                                            </p>
                                            {version.description && (
                                                <p
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        margin: "0.5rem 0 0 0",
                                                    }}
                                                >
                                                    {version.description}
                                                </p>
                                            )}
                                        </div>
                                        {!isCurrent && (
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                onPress={() => handleRestoreClick(version.version)}
                                            >
                                                Restore
                                            </Button>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Restore Confirmation Modal */}
            <Modal isOpen={restoreVersion !== null} onClose={handleCancelRestore} size="md">
                <ModalContent>
                    <ModalHeader>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                            Restore Version {restoreVersion}
                        </h3>
                    </ModalHeader>
                    <ModalBody>
                        <p style={{ margin: 0 }}>
                            Are you sure you want to restore this version? This will create a new
                            version with the restored data. Your current version will be preserved
                            in the history.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={handleCancelRestore}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleConfirmRestore}>
                            Restore Version
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
