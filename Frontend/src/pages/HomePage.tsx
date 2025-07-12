import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FilterBar from '@/components/questions/FilterBar';
import QuestionCard from '@/components/questions/QuestionCard';
import { mockQuestions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface HomePageProps {
  onAskQuestion?: () => void;
  onQuestionClick?: (questionId: string) => void;
  searchQuery?: string;
}

const QUESTIONS_PER_PAGE = 10;

const HomePage = ({ onAskQuestion, onQuestionClick, searchQuery = '' }: HomePageProps) => {
  const { questions: contextQuestions } = useAuth();
  const [currentFilter, setCurrentFilter] = useState('Newest');
  const [currentSort, setCurrentSort] = useState('Recent');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Combine mock questions with real-time questions from context
  const allQuestions = useMemo(() => {
    return [...contextQuestions, ...mockQuestions];
  }, [contextQuestions]);

  // Simple vote handler - just update the vote count
  const handleVote = (questionId: string, voteType: 'up' | 'down', newVoteCount: number) => {
    console.log(`Vote ${voteType} on question ID: ${questionId}, new count: ${newVoteCount}`);
    // Note: For real implementation, this would update the question in the backend
  };

  // Auto-categorize questions based on their content/tags
  const getCategoryForQuestion = (question: any) => {
    const tags = question.tags.map((tag: string) => tag.toLowerCase());
    if (tags.some((tag: string) => ['react', 'javascript', 'typescript', 'node.js', 'python', 'api'].includes(tag))) {
      return 'Programming';
    }
    if (tags.some((tag: string) => ['css', 'html', 'design', 'ui', 'ux'].includes(tag))) {
      return 'Design';
    }
    if (tags.some((tag: string) => ['ai', 'machine-learning', 'data-science'].includes(tag))) {
      return 'Science';
    }
    if (tags.some((tag: string) => ['startup', 'business', 'marketing'].includes(tag))) {
      return 'Business';
    }
    return 'Technology';
  };

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...allQuestions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(question => 
        question.title.toLowerCase().includes(query) ||
        question.description.toLowerCase().includes(query) ||
        question.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(question => getCategoryForQuestion(question) === selectedCategory);
    }

    // Apply tag filter
    if (selectedTag !== 'All') {
      filtered = filtered.filter(question => 
        question.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Apply filters
    switch (currentFilter) {
      case 'Unanswered':
        filtered = filtered.filter(q => q.answers === 0);
        break;
      case 'Most Voted':
        filtered = filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'Newest':
      default:
        // Keep original order for newest
        break;
    }

    // Apply sorting
    switch (currentSort) {
      case 'Oldest':
        filtered = filtered.reverse();
        break;
      case 'Most Answers':
        filtered = filtered.sort((a, b) => b.answers - a.answers);
        break;
      case 'Recent':
      default:
        // Keep current order
        break;
    }

    return filtered;
  }, [allQuestions, currentFilter, currentSort, selectedCategory, selectedTag, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [currentFilter, currentSort, selectedCategory, selectedTag, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 pt-8 pb-12">
      {/* Search Results Header */}
      {searchQuery.trim() && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Search results for "{searchQuery}"
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Filters */}
      <FilterBar 
        onFilterChange={setCurrentFilter}
        onSortChange={setCurrentSort}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
      />

      {/* Question List */}
      <div className="space-y-4">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              {...question}
              onClick={() => onQuestionClick?.(question.id)}
              onVote={handleVote}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery.trim() ? 'No questions found matching your search.' : 'No questions available.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default HomePage;
