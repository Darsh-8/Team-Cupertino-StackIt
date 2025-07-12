
import { Bell, Search, Plus, Menu, X, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from '@/components/auth/LoginDialog';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

interface HeaderProps {
  onAskQuestion?: () => void;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  onHomeClick?: () => void;
}

const Header = ({ onAskQuestion, onSearch, onProfileClick, onAdminClick, onHomeClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoggedIn } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Trigger search on every keystroke for real-time search
    onSearch?.(query);
  };

  const handleLogoClick = () => {
    onHomeClick?.();
  };

  // Check if user is admin
  const isAdmin = user?.isAdmin || user?.email === 'admin@xyz.in';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleLogoClick}
              >
                StackIt
              </h1>
              {isAdmin && (
                <div className="ml-3 flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search questions by title, content, or tags..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn && <NotificationDropdown />}
              
              <Button 
                onClick={onAskQuestion}
                className="bg-black text-white hover:bg-gray-900 rounded-full px-4 py-2 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onAdminClick}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onProfileClick}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.initials}
                    </div>
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search questions by title, content, or tags..."
                  className="pl-10 bg-gray-50"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </form>
              
              {isLoggedIn && (
                <div className="flex justify-center">
                  <NotificationDropdown />
                </div>
              )}
              
              <Button 
                onClick={onAskQuestion}
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={onAdminClick}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={onProfileClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </>
  );
};

export default Header;
