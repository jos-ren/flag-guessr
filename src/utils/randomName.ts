const ADJECTIVES = ['Swift', 'Bold', 'Keen', 'Bright', 'Calm', 'Dark', 'Sharp', 'Cool', 'Wild', 'Brave', 'Slick', 'Lone', 'Proud', 'Stout', 'Grim', 'Fair', 'Stark', 'Nimble', 'Fierce', 'Quick'];
const NOUNS = ['Eagle', 'Fox', 'Hawk', 'Bear', 'Lynx', 'Wolf', 'Raven', 'Owl', 'Crane', 'Drake', 'Heron', 'Viper', 'Falcon', 'Stoat', 'Cobra', 'Dingo', 'Moose', 'Bison', 'Panda', 'Otter'];

export function randomName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]!;
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]!;
  return `${adj} ${noun}`;
}
