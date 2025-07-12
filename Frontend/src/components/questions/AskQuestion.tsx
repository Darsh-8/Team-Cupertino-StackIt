
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { generatePseudonym } from '@/utils/pseudonym';
import { useToast } from '@/hooks/use-toast';

interface AskQuestionProps {
  onBack?: () => void;
}

const AskQuestion = ({ onBack }: AskQuestionProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const availableTags = ['react', 'javascript', 'typescript', 'css', 'html', 'nodejs', 'python', 'sql'];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (isValid) {
      const pseudonym = isAnonymous ? generatePseudonym() : null;
      console.log('Submitting question:', { 
        title, 
        description, 
        tags, 
        isAnonymous,
        pseudonym
      });
      
      toast({
        title: "Question submitted",
        description: isAnonymous 
          ? `Your anonymous question has been posted as ${pseudonym}!`
          : "Your question has been posted successfully!",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setTags([]);
      setIsAnonymous(false);
    }
  };

  const isValid = title.length >= 10 && description.length >= 20 && tags.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1 h-auto">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Ask a Question</h1>
      </div>

      <div className="space-y-8">
        {/* Anonymous Mode Toggle */}
        <Card className="p-4 border-gray-200">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
              Ask Anonymously
            </label>
          </div>
          {isAnonymous && (
            <p className="text-xs text-gray-500 mt-2">
              Your question will be posted with a generated pseudonym instead of your name.
            </p>
          )}
        </Card>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            type="text"
            placeholder="What's your programming question? Be specific."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
          />
          <p className="text-xs text-gray-500">
            {title.length}/10 minimum characters
          </p>
        </div>

        {/* Description with Rich Text Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <div className="text-xs text-gray-500 mb-2">HTML Rich Text</div>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Provide more details about your question. Include any relevant code, error messages, or context that would help others understand your problem."
          />
          <p className="text-xs text-gray-500">
            {description.length}/20 minimum characters
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Tags</label>
          
          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 px-3 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}

          {/* Add New Tag */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newTag);
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTag(newTag)}
              disabled={!newTag || tags.includes(newTag)}
            >
              Add
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !tags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 text-xs"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Validation Messages */}
        {!isValid && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Please complete the following:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {title.length < 10 && <li>• Title must be at least 10 characters</li>}
              {description.length < 20 && <li>• Description must be at least 20 characters</li>}
              {tags.length === 0 && <li>• Add at least one tag</li>}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            variant="outline"
            className="px-8 py-3 text-center font-medium disabled:bg-gray-300 disabled:cursor-not-allowed border-2 border-gray-300 hover:bg-gray-50"
          >
            {isAnonymous ? 'Submit Anonymously' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
