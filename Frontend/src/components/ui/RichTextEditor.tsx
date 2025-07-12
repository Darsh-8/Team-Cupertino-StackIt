
import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const toggleFormat = (format: string) => {
    setActiveFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const toolbarButtons = [
    { icon: Bold, format: 'bold', title: 'Bold' },
    { icon: Italic, format: 'italic', title: 'Italic' },
    { icon: Strikethrough, format: 'strikethrough', title: 'Strikethrough' },
    { icon: List, format: 'bullet-list', title: 'Bullet List' },
    { icon: ListOrdered, format: 'numbered-list', title: 'Numbered List' },
    { icon: Quote, format: 'blockquote', title: 'Quote' },
    { icon: Code, format: 'code', title: 'Code' },
    { icon: Link, format: 'link', title: 'Link' },
    { icon: AlignLeft, format: 'align-left', title: 'Align Left' },
    { icon: AlignCenter, format: 'align-center', title: 'Align Center' },
    { icon: AlignRight, format: 'align-right', title: 'Align Right' },
  ];

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map(({ icon: Icon, format, title }) => (
          <Button
            key={format}
            variant="ghost"
            size="sm"
            onClick={() => toggleFormat(format)}
            className={`h-8 w-8 p-0 ${
              activeFormats.includes(format) 
                ? 'bg-gray-200 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Text Area */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-64 border-0 rounded-none resize-none focus:ring-0 focus:border-0 text-base leading-relaxed"
      />
    </div>
  );
};

export default RichTextEditor;
