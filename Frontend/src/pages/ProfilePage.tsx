
import { ArrowLeft, Mail, Calendar, Award, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePageProps {
  onBack?: () => void;
}

const ProfilePage = ({ onBack }: ProfilePageProps) => {
  const { user, logout, notifications } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Get recent activity from notifications
  const recentActivity = notifications.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1 h-auto">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-500">Back to Questions</span>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>Member since Dec 2024</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-gray-600">Questions Asked</div>
        </Card>
        
        <Card className="p-6 text-center">
          <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-gray-600">Answers Given</div>
        </Card>
        
        <Card className="p-6 text-center">
          <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-gray-900">43</div>
          <div className="text-gray-600">Reputation</div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div>
                  <div className="font-medium text-gray-900">Activity</div>
                  <div className="text-sm text-gray-600">{activity.message}</div>
                </div>
                <Badge variant="secondary">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity to display.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-100 text-blue-800">React</Badge>
          <Badge className="bg-green-100 text-green-800">JavaScript</Badge>
          <Badge className="bg-purple-100 text-purple-800">TypeScript</Badge>
          <Badge className="bg-orange-100 text-orange-800">Node.js</Badge>
          <Badge className="bg-red-100 text-red-800">CSS</Badge>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
