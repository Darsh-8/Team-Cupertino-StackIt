
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoteWidgetProps {
  votes: number;
  userVote?: 'up' | 'down' | null;
  onVote?: (type: 'up' | 'down', newVoteCount: number) => void;
  size?: 'sm' | 'md';
}

const VoteWidget = ({ votes, userVote, onVote, size = 'md' }: VoteWidgetProps) => {
  const [voteCount, setVoteCount] = useState(votes);

  useEffect(() => {
    setVoteCount(votes);
  }, [votes]);

  const handleUpVote = () => {
    const newCount = voteCount + 1;
    setVoteCount(newCount);
    onVote?.('up', newCount);
  };

  const handleDownVote = () => {
    const newCount = voteCount - 1;
    setVoteCount(newCount);
    onVote?.('down', newCount);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={handleUpVote}
        className={cn(
          'flex items-center justify-center rounded-full border-2 transition-all hover:scale-105',
          sizeClasses[size],
          'border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500'
        )}
      >
        <ChevronUp className={iconSizeClasses[size]} />
      </button>
      
      <span className={cn(
        'font-medium text-center min-w-0',
        size === 'sm' ? 'text-sm' : 'text-base',
        voteCount > 0 ? 'text-green-600' : voteCount < 0 ? 'text-red-600' : 'text-gray-600'
      )}>
        {voteCount}
      </span>
      
      <button
        onClick={handleDownVote}
        className={cn(
          'flex items-center justify-center rounded-full border-2 transition-all hover:scale-105',
          sizeClasses[size],
          'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
        )}
      >
        <ChevronDown className={iconSizeClasses[size]} />
      </button>
    </div>
  );
};

export default VoteWidget;
