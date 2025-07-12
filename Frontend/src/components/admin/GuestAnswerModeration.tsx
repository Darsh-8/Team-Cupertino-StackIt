
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Ban, AlertTriangle, Clock, Shield, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface GuestAnswer {
  id: string;
  content: string;
  nickname: string;
  questionTitle: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isSuspected: boolean;
  flags: string[];
  metadata: {
    ip: string;
    userAgent: string;
  };
}

const mockGuestAnswers: GuestAnswer[] = [
  {
    id: '1',
    content: 'This is a helpful answer that explains the concept clearly with examples. React hooks are powerful tools for managing state and lifecycle in functional components.',
    nickname: 'Guest Owl',
    questionTitle: 'How to use React hooks effectively?',
    submittedAt: '3 minutes ago',
    status: 'pending',
    isSuspected: false,
    flags: [],
    metadata: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  },
  {
    id: '2',
    content: 'Buy now! Best deals! Click here for amazing discounts! Visit our website for more offers!',
    nickname: 'Anonymous Guest',
    questionTitle: 'What is the best way to learn JavaScript?',
    submittedAt: '5 minutes ago',
    status: 'pending',
    isSuspected: true,
    flags: ['Too many promotional words', 'Suspected spam', 'Multiple links'],
    metadata: {
      ip: '45.123.45.67',
      userAgent: 'Bot/1.0'
    }
  },
  {
    id: '3',
    content: 'Great question! I recommend starting with the official documentation and building small projects.',
    nickname: 'Helpful Fox',
    questionTitle: 'Best resources for learning TypeScript?',
    submittedAt: '1 hour ago',
    status: 'approved',
    isSuspected: false,
    flags: [],
    metadata: {
      ip: '10.0.0.5',
      userAgent: 'Mozilla/5.0 (Mac; Intel Mac OS X)'
    }
  },
  {
    id: '4',
    content: 'spam spam spam',
    nickname: 'Guest',
    questionTitle: 'How to center a div?',
    submittedAt: '2 hours ago',
    status: 'rejected',
    isSuspected: true,
    flags: ['Too short', 'Repetitive content'],
    metadata: {
      ip: '123.45.67.89',
      userAgent: 'Bot/Spam'
    }
  }
];

const GuestAnswerModeration = () => {
  const [guestAnswers, setGuestAnswers] = useState<GuestAnswer[]>(mockGuestAnswers);
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin');

  if (!isAdmin) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </Card>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    setGuestAnswers(prev => 
      prev.map(answer => 
        answer.id === id ? { ...answer, status: 'approved' as const } : answer
      )
    );
    toast({
      title: "Guest answer approved and published",
      description: "The answer is now visible to all users.",
    });
  };

  const handleReject = (id: string) => {
    setGuestAnswers(prev => 
      prev.map(answer => 
        answer.id === id ? { ...answer, status: 'rejected' as const } : answer
      )
    );
    toast({
      title: "Guest answer rejected",
      description: "The answer has been rejected and will not be visible.",
    });
  };

  const handleBanIP = (id: string) => {
    const answer = guestAnswers.find(a => a.id === id);
    if (answer) {
      handleReject(id);
      toast({
        title: "IP banned and answer rejected",
        description: `IP ${answer.metadata.ip} has been banned from posting.`,
        variant: "destructive"
      });
    }
  };

  const getFilteredAnswers = (filter: string) => {
    switch (filter) {
      case 'pending':
        return guestAnswers.filter(answer => answer.status === 'pending');
      case 'approved':
        return guestAnswers.filter(answer => answer.status === 'approved');
      case 'rejected':
        return guestAnswers.filter(answer => answer.status === 'rejected');
      case 'suspected':
        return guestAnswers.filter(answer => answer.isSuspected);
      default:
        return guestAnswers;
    }
  };

  const filteredAnswers = getFilteredAnswers(activeTab);
  const pendingCount = guestAnswers.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel: Guest Answer Moderation</h1>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          {pendingCount} Pending Review
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex rounded-full bg-muted p-1 gap-2">
          <TabsTrigger value="all" className="rounded-full px-4 py-2">All</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full px-4 py-2">
            Pending {pendingCount > 0 && <Badge className="ml-2 bg-orange-500">{pendingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-full px-4 py-2">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-full px-4 py-2">Rejected</TabsTrigger>
          <TabsTrigger value="suspected" className="rounded-full px-4 py-2">
            Suspected <AlertTriangle className="ml-1 h-3 w-3" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAnswers.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guest answers found</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' ? 'All guest answers have been reviewed.' : `No ${activeTab} answers to display.`}
              </p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Answer Preview</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Nickname</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnswers.map((answer) => (
                    <>
                      <TableRow 
                        key={answer.id}
                        className={`
                          ${answer.isSuspected ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'hover:bg-gray-50'} 
                          cursor-pointer transition-colors
                        `}
                        onClick={() => setExpandedRow(expandedRow === answer.id ? null : answer.id)}
                      >
                        <TableCell className="max-w-xs">
                          <p className="line-clamp-2 text-sm text-gray-700">
                            {answer.content}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium text-blue-600 truncate max-w-[200px]">
                              {answer.questionTitle}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{answer.nickname}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {answer.flags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                                {flag}
                              </Badge>
                            ))}
                            {answer.isSuspected && answer.flags.length === 0 && (
                              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{answer.submittedAt}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {answer.status === 'pending' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBanIP(answer.id);
                                  }}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Ban className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(answer.id);
                                  }}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(answer.id);
                                  }}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Badge 
                                variant={answer.status === 'approved' ? 'default' : 'destructive'}
                                className={answer.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {answer.status === 'approved' ? 'Approved' : 'Rejected'}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {expandedRow === answer.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-gray-50 p-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Full Answer Content</h4>
                                <div className="bg-white p-4 rounded-lg border text-gray-700">
                                  {answer.content}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">IP Address:</span>
                                  <p className="text-gray-600">{answer.metadata.ip}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">User Agent:</span>
                                  <p className="text-gray-600 truncate">{answer.metadata.userAgent}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Status:</span>
                                  <p className="text-gray-600 capitalize">{answer.status}</p>
                                </div>
                              </div>

                              {answer.flags.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700">Triggered Flags:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {answer.flags.map((flag, index) => (
                                      <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                                        {flag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuestAnswerModeration;
