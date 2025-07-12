import { ArrowLeft, Eye, Clock, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import VoteWidget from '@/components/ui/VoteWidget';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { generatePseudonym, getAnonymousAvatar } from '@/utils/pseudonym';

interface Answer {
  id: string;
  content: string;
  author: {
    name: string;
    initials: string;
  };
  votes: number;
  timeAgo: string;
  isAccepted?: boolean;
  isGuest?: boolean;
  isAnonymous?: boolean;
  pseudonym?: string;
}

interface QuestionDetailProps {
  question: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    author: {
      name: string;
      initials: string;
    };
    votes: number;
    views: number;
    timeAgo: string;
    isAnonymous?: boolean;
    pseudonym?: string;
  };
  answers: Answer[];
  onBack?: () => void;
}

const QuestionDetail = ({ question, answers, onBack }: QuestionDetailProps) => {
  const [newAnswer, setNewAnswer] = useState('');
  const [guestNickname, setGuestNickname] = useState('');
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [postAsGuest, setPostAsGuest] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [guestPseudonym, setGuestPseudonym] = useState('');
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  // Generate pseudonym when switching to guest mode
  const handlePostAsGuest = () => {
    setPostAsGuest(true);
    if (!guestPseudonym) {
      setGuestPseudonym(generatePseudonym());
    }
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      const pseudonym = isAnonymous ? generatePseudonym() : null;
      console.log('Submitting answer:', {
        content: newAnswer,
        isAnonymous,
        pseudonym
      });
      
      toast({
        title: "Answer submitted",
        description: isAnonymous 
          ? `Your anonymous answer has been posted as ${pseudonym}!`
          : "Your answer has been posted successfully!",
      });
      setNewAnswer('');
      setIsAnonymous(false);
    }
  };

  const handleSubmitGuestAnswer = async () => {
    if (!newAnswer.trim()) return;

    setIsSubmittingGuest(true);
    
    // Simulate processing time for moderation check
    setTimeout(() => {
      console.log('Submitting guest answer:', {
        content: newAnswer,
        nickname: guestNickname || 'Anonymous Guest',
        questionId: question.id,
        pseudonym: guestPseudonym
      });
      
      toast({
        title: "Answer submitted for review",
        description: `Your answer has been submitted as ${guestPseudonym} and will appear once approved by a moderator.`,
      });
      
      setNewAnswer('');
      setGuestNickname('');
      setGuestPseudonym('');
      setIsSubmittingGuest(false);
      setPostAsGuest(false);
    }, 2000);
  };

  const renderAuthor = (author: Answer['author'], isAnonymous?: boolean, pseudonym?: string, isGuest?: boolean) => {
    if (isAnonymous && pseudonym) {
      const avatarColor = getAnonymousAvatar(pseudonym);
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
            {pseudonym.charAt(0)}
          </div>
          <span className="text-sm text-gray-700 font-medium">{pseudonym}</span>
          <Badge variant="outline" className="text-xs">Anonymous</Badge>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {isGuest && (
          <Badge variant="outline" className="text-xs">Guest</Badge>
        )}
        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {author.initials}
        </div>
        <span className="text-sm text-gray-700 font-medium">{author.name}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button and breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1 h-auto">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span>Questions</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{question.title}</span>
      </div>

      {/* Question */}
      <Card className="p-6 border-gray-200">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <VoteWidget votes={question.votes} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
            
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Asked {question.timeAgo}</span>
                </div>
              </div>

              {renderAuthor(question.author, question.isAnonymous, question.pseudonym)}
            </div>
          </div>
        </div>
      </Card>

      {/* Answers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {answers.map((answer) => (
          <Card key={answer.id} className={`p-6 border-gray-200 ${answer.isAccepted ? 'ring-2 ring-green-200 bg-green-50/30' : ''}`}>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <VoteWidget votes={answer.votes} size="sm" />
              </div>
              
              <div className="flex-1 min-w-0">
                {answer.isAccepted && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Check className="h-3 w-3" />
                      <span>Accepted Answer</span>
                    </div>
                  </div>
                )}
                
                <div className="prose prose-gray max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed">{answer.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">{answer.timeAgo}</span>
                  {renderAuthor(answer.author, answer.isAnonymous, answer.pseudonym, answer.isGuest)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Answer */}
      <Card className="p-6 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Answer</h3>
        
        {isLoggedIn ? (
          <div className="space-y-4">
            {/* Anonymous Mode Toggle */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="anonymous-answer"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label htmlFor="anonymous-answer" className="text-sm font-medium text-gray-700 cursor-pointer">
                Answer Anonymously
              </label>
            </div>
            {isAnonymous && (
              <p className="text-xs text-gray-500">
                Your answer will be posted with a generated pseudonym instead of your name.
              </p>
            )}
            
            <Textarea
              placeholder="Write your answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-32 resize-none"
            />
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePostAsGuest}
                className="text-gray-600"
              >
                Post as Guest Instead
              </Button>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim()}
                className="bg-black text-white hover:bg-gray-900"
              >
                {isAnonymous ? 'Submit Anonymously' : 'Submit Answer'}
              </Button>
            </div>
          </div>
        ) : postAsGuest ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                You're posting as a guest. Your answer will be reviewed before it goes live.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guest-pseudonym">Username</Label>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${getAnonymousAvatar(guestPseudonym)} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                  {guestPseudonym.charAt(0)}
                </div>
                <Input
                  id="guest-pseudonym"
                  value={guestPseudonym}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500">This username has been generated for you</p>
            </div>
            
            <Textarea
              placeholder="Write your answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-32 resize-none"
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setPostAsGuest(false);
                  setGuestPseudonym('');
                }}
                disabled={isSubmittingGuest}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitGuestAnswer}
                disabled={!newAnswer.trim() || isSubmittingGuest}
                className="bg-black text-white hover:bg-gray-900"
              >
                {isSubmittingGuest ? 'Checking your answer...' : 'Post as Guest'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <Lock className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Sign in to answer</h4>
            <p className="text-gray-600 mb-4">You need to be logged in to contribute to this question.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-black text-white hover:bg-gray-900">
                Sign In to Answer
              </Button>
              <Button 
                variant="outline"
                onClick={handlePostAsGuest}
                className="border-gray-300"
              >
                Answer as Guest
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionDetail;
