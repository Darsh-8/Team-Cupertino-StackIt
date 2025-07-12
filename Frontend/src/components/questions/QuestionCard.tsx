
import { MessageCircle, Clock } from 'lucide-react';
import VoteWidget from '@/components/ui/VoteWidget';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getAnonymousAvatar } from '@/utils/pseudonym';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  votes: number;
  userVote?: 'up' | 'down' | null;
  answers: number;
  timeAgo: string;
  isAnonymous?: boolean;
  pseudonym?: string;
  onClick?: () => void;
  onVote?: (questionId: string, voteType: 'up' | 'down', newVoteCount: number) => void;
}

const QuestionCard = ({
  id,
  title,
  description,
  tags,
  author,
  votes,
  userVote,
  answers,
  timeAgo,
  isAnonymous,
  pseudonym,
  onClick,
  onVote
}: QuestionCardProps) => {
  const isMobile = useIsMobile();
  
  const handleVote = (voteType: 'up' | 'down', newVoteCount: number) => {
    if (onVote) {
      onVote(id, voteType, newVoteCount);
    }
  };

  const renderAuthor = () => {
    if (isAnonymous && pseudonym) {
      const avatarColor = getAnonymousAvatar(pseudonym);
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-5 h-5 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
            {pseudonym.charAt(0)}
          </div>
          <span className="text-xs text-gray-600 font-medium">{pseudonym}</span>
          {!isMobile && <Badge variant="outline" className="text-xs">Anonymous</Badge>}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {author.initials}
        </div>
        <span className="text-xs text-gray-600 font-medium">{author.name}</span>
      </div>
    );
  };

  return (
    <Card 
      className={`${isMobile ? 'p-3' : 'p-5'} hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200`}
      onClick={onClick}
    >
      <div className={`flex ${isMobile ? 'gap-2' : 'gap-4'}`}>
        {/* Vote Widget */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <VoteWidget 
            votes={votes} 
            userVote={userVote}
            size="sm" 
            onVote={handleVote} 
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors`}>
            {title}
          </h3>
          
          <p className={`text-sm text-gray-600 ${isMobile ? 'mt-1 line-clamp-1' : 'mt-2 line-clamp-2'} leading-relaxed`}>
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className={`flex flex-wrap gap-1 ${isMobile ? 'mt-2' : 'mt-3'}`}>
              {(isMobile ? tags.slice(0, 2) : tags).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className={`bg-gray-100 text-gray-700 hover:bg-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'} rounded-full font-medium`}
                >
                  {tag}
                </Badge>
              ))}
              {isMobile && tags.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded-full font-medium"
                >
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Author Info - Simplified for mobile */}
          <div className={`flex items-center justify-between ${isMobile ? 'mt-2 pt-2' : 'mt-4 pt-3'} border-t border-gray-100`}>
            {isMobile ? (
              // Mobile: Only show author
              renderAuthor()
            ) : (
              // Desktop: Show full metadata
              <>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{answers} answers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
                {renderAuthor()}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
