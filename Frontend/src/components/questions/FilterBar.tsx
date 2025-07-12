
import { useState } from 'react';
import { ChevronDown, Filter, Tag, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterBarProps {
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (category: string) => void;
  onTagChange?: (tag: string) => void;
}

const FilterBar = ({ onFilterChange, onSortChange, onCategoryChange, onTagChange }: FilterBarProps) => {
  const [activeFilter, setActiveFilter] = useState('Newest');
  const [sortOrder, setSortOrder] = useState('Recent');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  const filters = ['Newest', 'Unanswered', 'Most Voted'];
  const sortOptions = ['Recent', 'Oldest', 'Most Answers'];
  const categories = ['All', 'Technology', 'Science', 'Programming', 'Design', 'Business', 'General'];
  const tags = ['All', 'React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Node.js', 'Python', 'API'];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSortClick = (sort: string) => {
    setSortOrder(sort);
    onSortChange?.(sort);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    onTagChange?.(tag);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(filter)}
            className={`rounded-full font-medium transition-all ${
              activeFilter === filter 
                ? 'bg-black text-white hover:bg-gray-900' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {filter}
          </Button>
        ))}

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full font-medium">
              <Grid3x3 className="mr-2 h-3 w-3" />
              {selectedCategory === 'All' ? 'Category' : selectedCategory}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category ? 'bg-gray-100' : ''}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full font-medium">
              <Tag className="mr-2 h-3 w-3" />
              {selectedTag === 'All' ? 'Tags' : selectedTag}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {tags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={selectedTag === tag ? 'bg-gray-100' : ''}
              >
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full font-medium">
            <Filter className="mr-2 h-3 w-3" />
            {sortOrder}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleSortClick(option)}
              className={sortOrder === option ? 'bg-gray-100' : ''}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterBar;
