import type { Character, GameSession } from '@hollow-gear/model';

// Example usage of the model package
const character: Character = {
  id: '1',
  name: 'Test Character',
  level: 1,
};

const session: GameSession = {
  id: '1',
  name: 'Test Session',
  characters: [character],
};

console.log('Hollow Gear TTRPG Project');
console.log('Character:', character);
console.log('Session:', session);
