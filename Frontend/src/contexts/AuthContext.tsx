
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  isAdmin?: boolean;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface Question {
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
  answers: number;
  timeAgo: string;
  isAnonymous?: boolean;
  pseudonym?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  notifications: Notification[];
  unreadCount: number;
  questions: Question[];
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  addNotification: (message: string) => void;
  markNotificationsAsRead: () => void;
  addQuestion: (question: Question) => void;
  moderateQuestion: (questionId: string, action: 'approve' | 'reject') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const login = (email: string, password: string, name?: string): boolean => {
    // Check for admin credentials
    if (email === 'admin@xyz.in' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@xyz.in',
        initials: 'AD',
        isAdmin: true
      };
      setUser(adminUser);
      console.log('Admin logged in:', adminUser);
      
      // Add admin notifications
      const adminNotifications: Notification[] = [
        {
          id: '1',
          message: 'New question pending moderation: "How to handle async/await in JavaScript?"',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: false
        },
        {
          id: '2',
          message: 'Question approved: "Best practices for React state management"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false
        }
      ];
      setNotifications(adminNotifications);
      return true;
    }

    // Check for dummy user credentials
    if (email === 'trial1@gmail.com' && password === 'trial') {
      const dummyUser: User = {
        id: 'trial-001',
        name: 'Trial User',
        email: 'trial1@gmail.com',
        initials: 'TU',
        isAdmin: false
      };
      setUser(dummyUser);
      console.log('Trial user logged in:', dummyUser);
      
      // Add some sample notifications for the trial user
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          message: 'Your question "How to handle async/await in JavaScript?" received a new answer!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false
        },
        {
          id: '2',
          message: 'Someone upvoted your answer on React state management.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          read: false
        },
        {
          id: '3',
          message: 'Your question about Django REST API has been marked as solved!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true
        }
      ];
      setNotifications(sampleNotifications);
      return true;
    }
    
    // Regular user login
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : email.substring(0, 2).toUpperCase();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      initials,
      isAdmin: false
    };
    setUser(newUser);
    console.log('User logged in:', newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    setQuestions([]);
    console.log('User logged out');
  };

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const addQuestion = (question: Question) => {
    const newQuestion = {
      ...question,
      id: Math.random().toString(36).substr(2, 9),
      timeAgo: 'Just now',
      status: 'approved' as const
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
    
    // Notify admin of new question for moderation
    if (user?.isAdmin) {
      addNotification(`New question submitted: "${question.title}"`);
    }
    
    console.log('Question added:', newQuestion);
  };

  const moderateQuestion = (questionId: string, action: 'approve' | 'reject') => {
    setQuestions(prev => 
      prev.map(question => {
        if (question.id === questionId) {
          if (action === 'reject') {
            // Remove rejected questions
            return null;
          }
          return { ...question, status: 'approved' as const };
        }
        return question;
      }).filter(Boolean) as Question[]
    );
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      addNotification(`Question "${question.title}" has been ${action}d`);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      notifications,
      unreadCount,
      questions,
      login,
      logout,
      addNotification,
      markNotificationsAsRead,
      addQuestion,
      moderateQuestion
    }}>
      {children}
    </AuthContext.Provider>
  );
};
