import type { Skills as CharacterSkills } from "@/model/character-view-model";

export const Skills = ({ skills }: { skills: CharacterSkills }) => {
    const skillEntries = Object.entries(skills);

    return (
        <div className="space-y-1">
            {skillEntries.map(([skillName, skillData]) => (
                <div
                    key={skillName}
                    className="flex items-center gap-2 py-1 px-2 hover:bg-default-100 rounded"
                >
                    {/* Proficiency Circle */}
                    <div className="flex-shrink-0">
                        {skillData.proficient ? (
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                {skillData.expertise && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                        ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-default-300"></div>
                        )}
                    </div>

                    {/* Skill Name */}
                    <div className="flex-1 text-sm font-medium">{skillName}</div>

                    {/* Ability */}
                    <div className="text-xs text-default-500 uppercase w-8 text-center">
                        {skillData.ability}
                    </div>

                    {/* Modifier */}
                    <div className="text-sm font-semibold w-10 text-right">
                        {skillData.modifier}
                    </div>
                </div>
            ))}
        </div>
    );
};
