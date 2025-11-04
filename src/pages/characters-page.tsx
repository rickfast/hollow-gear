import { CharacterList } from "@/components/character-list";
import { useNavigate } from "react-router-dom";

export function CharactersPage() {
    const navigate = useNavigate();

    const handleSelectCharacter = (id: string) => {
        navigate(`/characters/${id}`);
    };

    const handleEditCharacter = (id: string) => {
        navigate(`/characters/${id}/edit`);
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <CharacterList
                onSelectCharacter={handleSelectCharacter}
                onEditCharacter={handleEditCharacter}
            />
        </div>
    );
}
