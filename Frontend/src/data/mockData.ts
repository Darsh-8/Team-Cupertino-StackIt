
export const mockQuestions = [
  {
    id: '1',
    title: 'React useState hook not updating state immediately',
    description: 'I\'m having trouble with useState not updating the state immediately when I call the setter function. The component doesn\'t re-render with the new value right away.',
    tags: ['react', 'javascript', 'hooks'],
    author: {
      name: 'John Developer',
      avatar: '/placeholder.svg',
      initials: 'JD'
    },
    votes: 12,
    userVote: null,
    answers: 3,
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    title: 'How to center a div in CSS?',
    description: 'I\'ve been trying different methods to center a div both horizontally and vertically, but nothing seems to work consistently across different browsers.',
    tags: ['css', 'html'],
    author: {
      name: 'Silent Lemur #234',
      avatar: '/placeholder.svg',
      initials: 'SL'
    },
    votes: 8,
    userVote: null,
    answers: 5,
    timeAgo: '4 hours ago',
    isAnonymous: true,
    pseudonym: 'Silent Lemur #234'
  },
  {
    id: '3',
    title: 'TypeScript generic constraints best practices',
    description: 'What are the best practices when working with generic constraints in TypeScript? I want to ensure type safety while maintaining flexibility.',
    tags: ['typescript', 'generics'],
    author: {
      name: 'Sarah Wilson',
      avatar: '/placeholder.svg',
      initials: 'SW'
    },
    votes: 15,
    userVote: null,
    answers: 2,
    timeAgo: '6 hours ago'
  },
  {
    id: '4',
    title: 'Node.js async/await error handling patterns',
    description: 'I\'m looking for the most effective patterns to handle errors when using async/await in Node.js applications.',
    tags: ['nodejs', 'javascript', 'async'],
    author: {
      name: 'Brave Otter #145',
      avatar: '/placeholder.svg',
      initials: 'BO'
    },
    votes: 6,
    userVote: null,
    answers: 1,
    timeAgo: '8 hours ago',
    isAnonymous: true,
    pseudonym: 'Brave Otter #145'
  },
  {
    id: '5',
    title: 'Python list comprehension vs traditional loops performance',
    description: 'When should I use list comprehensions vs traditional for loops in Python? Are there significant performance differences?',
    tags: ['python', 'performance'],
    author: {
      name: 'Mike Chen',
      avatar: '/placeholder.svg',
      initials: 'MC'
    },
    votes: 11,
    userVote: null,
    answers: 4,
    timeAgo: '12 hours ago'
  }
];

export const mockQuestion = {
  id: '1',
  title: 'React useState hook not updating state immediately',
  content: 'I\'m having trouble with useState not updating the state immediately when I call the setter function. The component doesn\'t re-render with the new value right away. Here\'s my code:\n\n```javascript\nconst [count, setCount] = useState(0);\n\nconst handleClick = () => {\n  setCount(count + 1);\n  console.log(count); // This still shows the old value\n};\n```\n\nWhy does this happen and how can I fix it?',
  tags: ['react', 'javascript', 'hooks'],
  author: {
    name: 'John Developer',
    initials: 'JD'
  },
  votes: 12,
  views: 156,
  timeAgo: '2 hours ago'
};

export const mockAnswers = [
  {
    id: '1',
    content: 'This is expected behavior in React. The `useState` setter function is asynchronous, and the state update won\'t be reflected immediately in the same render cycle. The `console.log(count)` will show the old value because it\'s executed before the re-render happens.\n\nTo fix this, you can use a functional update or the useEffect hook to see the updated value.',
    author: {
      name: 'Jane Smith',
      initials: 'JS'
    },
    votes: 8,
    timeAgo: '1 hour ago',
    isAccepted: true
  },
  {
    id: '2',
    content: 'You can also use the functional form of setState to ensure you\'re working with the latest state:\n\n```javascript\nsetCount(prevCount => {\n  console.log(prevCount + 1); // This will show the new value\n  return prevCount + 1;\n});\n```',
    author: {
      name: 'Clever Fox #892',
      initials: 'CF'
    },
    votes: 5,
    timeAgo: '45 minutes ago',
    isAnonymous: true,
    pseudonym: 'Clever Fox #892'
  },
  {
    id: '3',
    content: 'Another approach is to use useEffect to listen for state changes:\n\n```javascript\nuseEffect(() => {\n  console.log(count); // This will show the updated value\n}, [count]);\n```',
    author: {
      name: 'Guest Bear',
      initials: 'GB'
    },
    votes: 3,
    timeAgo: '30 minutes ago',
    isGuest: true
  }
];
