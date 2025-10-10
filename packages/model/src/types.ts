// Basic types for Hollow Gear TTRPG

export interface Character {
  id: string;
  name: string;
  level: number;
}

export interface GameSession {
  id: string;
  name: string;
  characters: Character[];
}
