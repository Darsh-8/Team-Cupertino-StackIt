
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import QuestionDetail from '@/components/questions/QuestionDetail';
import AskQuestion from '@/components/questions/AskQuestion';
import GuestAnswerModeration from '@/components/admin/GuestAnswerModeration';
import { mockQuestion, mockAnswers } from '@/data/mockData';

const queryClient = new QueryClient();

type View = 'home' | 'question' | 'ask' | 'profile' | 'admin';

const App = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAskQuestion = () => {
    setCurrentView('ask');
  };

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setCurrentView('question');
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleHomeClick = () => {
    setCurrentView('home');
    setSelectedQuestionId(null);
    setSearchQuery('');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedQuestionId(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Ensure we're on the home view when searching
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'ask':
        return <AskQuestion onBack={handleBack} />;
      case 'question':
        return (
          <QuestionDetail
            question={mockQuestion}
            answers={mockAnswers}
            onBack={handleBack}
          />
        );
      case 'profile':
        return <ProfilePage onBack={handleBack} />;
      case 'admin':
        return <GuestAnswerModeration />;
      default:
        return (
          <HomePage
            onAskQuestion={handleAskQuestion}
            onQuestionClick={handleQuestionClick}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Header 
              onAskQuestion={handleAskQuestion} 
              onSearch={handleSearch}
              onProfileClick={handleProfileClick}
              onAdminClick={handleAdminClick}
              onHomeClick={handleHomeClick}
            />
            <main>
              {renderCurrentView()}
            </main>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
