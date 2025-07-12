
const adjectives = [
  'Quiet', 'Curious', 'Bold', 'Sleepy', 'Gentle', 'Rapid', 'Shy', 'Clever', 
  'Brave', 'Calm', 'Swift', 'Wise', 'Kind', 'Noble', 'Silent', 'Bright'
];

const animals = [
  'Fox', 'Tiger', 'Lemur', 'Bear', 'Otter', 'Hawk', 'Gecko', 'Badger', 
  'Panda', 'Falcon', 'Wolf', 'Owl', 'Deer', 'Eagle', 'Lynx', 'Raven'
];

// Store used pseudonyms in memory (in real app, this would be in backend)
const usedPseudonyms = new Set<string>();

export function generatePseudonym(): string {
  let attempt = 0;
  while (attempt < 1000) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const name = `${adj} ${animal} #${num}`;
    
    if (!usedPseudonyms.has(name)) {
      usedPseudonyms.add(name);
      return name;
    }
    attempt++;
  }
  throw new Error('Unable to generate unique pseudonym');
}

export function getAnonymousAvatar(name: string): string {
  // Generate a consistent color based on the name
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
  const colorIndex = name.length % colors.length;
  return colors[colorIndex];
}
