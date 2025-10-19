import { Card, CardBody, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";

interface PortraitSelectorProps {
    selectedPortrait: string;
    onPortraitChange: (portrait: string) => void;
    speciesFilter?: string;
    classFilter?: string;
}

export function PortraitSelector({
    selectedPortrait,
    onPortraitChange,
    speciesFilter,
    classFilter,
}: PortraitSelectorProps) {
    const [portraits, setPortraits] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load available portraits from public/portraits directory
        // Since we can't directly list directory contents in the browser,
        // we'll generate the expected filenames based on species and classes
        const loadPortraits = async () => {
            const species = [
                "Aqualoth",
                "Vulmir",
                "Rendai",
                "Karnathi",
                "Tharn",
                "Skellin",
                "Avenar",
            ];
            const classes = [
                "Arcanist",
                "Templar",
                "Tweaker",
                "Shadehand",
                "Vanguard",
                "Artifex",
                "Mindweaver",
            ];

            const allPortraits: string[] = [];

            for (const sp of species) {
                for (const cls of classes) {
                    const filename = `${sp}-${cls}.png`;
                    const path = `/portraits/${filename}`;

                    // Check if the image exists by trying to load it
                    try {
                        const response = await fetch(path, { method: "HEAD" });
                        if (response.ok) {
                            allPortraits.push(path);
                        }
                    } catch {
                        // Image doesn't exist, skip it
                    }
                }
            }

            // Filter by species and class if provided
            let filtered = allPortraits;
            if (speciesFilter) {
                filtered = filtered.filter((p) => p.includes(`/${speciesFilter}-`));
            }
            if (classFilter) {
                filtered = filtered.filter((p) => p.includes(`-${classFilter}.png`));
            }

            setPortraits(filtered);
            setLoading(false);

            // Auto-select the first portrait if none selected and we have a match
            if (!selectedPortrait && filtered.length > 0) {
                onPortraitChange(filtered[0]!);
            }
        };

        loadPortraits();
    }, [speciesFilter, classFilter, selectedPortrait, onPortraitChange]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Select Portrait</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ textAlign: "center", padding: "2rem" }}>Loading portraits...</div>
                </CardBody>
            </Card>
        );
    }

    if (portraits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Select Portrait</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
                        No portraits available for this species/class combination.
                        <br />
                        Generate portraits using: <code>bun run generate.ts</code>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    Select Portrait ({portraits.length} available)
                </h3>
            </CardHeader>
            <CardBody>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {portraits.map((portrait) => {
                        const isSelected = selectedPortrait === portrait;
                        return (
                            <button
                                key={portrait}
                                onClick={() => onPortraitChange(portrait)}
                                style={{
                                    border: isSelected
                                        ? "4px solid hsl(var(--heroui-primary))"
                                        : "2px solid hsl(var(--heroui-default-200))",
                                    borderRadius: "12px",
                                    padding: "8px",
                                    cursor: "pointer",
                                    backgroundColor: isSelected
                                        ? "hsl(var(--heroui-primary) / 0.1)"
                                        : "hsl(var(--heroui-default-50))",
                                    transition: "all 0.2s",
                                    position: "relative",
                                    boxShadow: isSelected
                                        ? "0 0 0 2px hsl(var(--heroui-primary) / 0.3)"
                                        : "none",
                                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor =
                                            "hsl(var(--heroui-default-400))";
                                        e.currentTarget.style.transform = "scale(1.02)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor =
                                            "hsl(var(--heroui-default-200))";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }
                                }}
                            >
                                {isSelected && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "4px",
                                            right: "4px",
                                            backgroundColor: "hsl(var(--heroui-primary))",
                                            color: "white",
                                            borderRadius: "50%",
                                            width: "24px",
                                            height: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            zIndex: 1,
                                        }}
                                    >
                                        ✓
                                    </div>
                                )}
                                <img
                                    src={portrait}
                                    alt={portrait.split("/").pop()?.replace(".png", "")}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "6px",
                                        display: "block",
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        marginTop: "0.5rem",
                                        textAlign: "center",
                                        opacity: isSelected ? 1 : 0.7,
                                        fontWeight: isSelected ? 600 : 400,
                                        color: isSelected
                                            ? "hsl(var(--heroui-primary))"
                                            : "inherit",
                                    }}
                                >
                                    {portrait
                                        .split("/")
                                        .pop()
                                        ?.replace(".png", "")
                                        .replace("-", " ")}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}
