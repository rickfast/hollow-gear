console.log('Starting Hollow Gear TTRPG...');

import('@hollow-gear/core')
  .then(({ MODEL_VERSION }) => {
    console.log(`Hollow Gear TTRPG - Core Models v${MODEL_VERSION}`);
    console.log('Character models loaded successfully!');

    console.log('\nAvailable exports from @hollow-gear/core:');
    console.log('- HollowGearCharacter interface');
    console.log('- CharacterUtils for character operations');
    console.log('- All species, class, and equipment types');
    console.log('- Serialization and validation utilities');

    console.log('\nWorkspace structure:');
    console.log('- packages/core: Core character models and game mechanics');
    console.log('- Root: Main project coordination and build scripts');
  })
  .catch(error => {
    console.error('Failed to load core models:', error);
  });
