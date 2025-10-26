import { CharacterSheet } from "@/components/character-sheet";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export function CharacterSheetPage() {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!id) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <p>Character not found</p>
            </div>
        );
    }

    return <CharacterSheet id={id} />;
}
