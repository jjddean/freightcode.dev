import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color: string;
}

interface MobileMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

const MobileDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MobileMetric[]>([
    { label: 'Active', value: '12', change: '+2', trend: 'up', icon: '🚢' },
    { label: 'Pending', value: '5', change: '-1', trend: 'down', icon: '📋' },
    { label: 'Revenue', value: '£45K', change: '+8%', trend: 'up', icon: '💰' },
    { label: 'On-Time', value: '94%', change: '+2%', trend: 'up', icon: '⏰' }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, text: 'SH-2024-156 departed London', time: '2 min ago', type: 'departure' },
    { id: 2, text: 'Payment received £12,450', time: '5 min ago', type: 'payment' },
    { id: 3, text: 'Customs cleared Hamburg', time: '8 min ago', type: 'customs' },
    { id: 4, text: 'Document uploaded', time: '12 min ago', type: 'document' }
  ]);

  const quickActions: QuickAction[] = [
    { label: 'New Quote', icon: '💬', path: '/', color: 'bg-blue-500' },
    { label: 'Track', icon: '📍', path: '/shipments', color: 'bg-green-500' },
    { label: 'Upload Doc', icon: '📄', path: '/compliance', color: 'bg-yellow-500' },
    { label: 'Pay Invoice', icon: '💳', path: '/payments', color: 'bg-purple-500' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics occasionally
      if (Math.random() > 0.8) {
        setMetrics(prev => prev.map(metric => 
          metric.label === 'Active' 
            ? { ...metric, value: (parseInt(metric.value) + 1).toString() }
            : metric
        ));
      }

      // Add new activity
      if (Math.random() > 0.7) {
        const newActivity = {
          id: Date.now(),
          text: `SH-2024-${Math.floor(Math.random() * 999)} updated`,
          time: 'Just now',
          type: 'update' as const
        };
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'departure': return '🚚';
      case 'payment': return '💰';
      case 'customs': return '📋';
      case 'document': return '📄';
      case 'update': return '🔄';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Good morning! 👋</h2>
        <p className="text-primary-100">Here's your logistics overview</p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                metric.trend === 'up' ? 'text-green-700 bg-green-100' :
                metric.trend === 'down' ? 'text-red-700 bg-red-100' :
                'text-gray-700 bg-gray-100'
              )}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", action.color)}>
                <span className="text-xl">{action.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-center space-x-3 p-4",
                index !== recentActivity.length - 1 && "border-b border-gray-100"
              )}
            >
              <div className="text-lg">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button variant="outline" className="w-full" size="sm">
            View All Activity
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attention Required</h3>
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-900">Document Required</h4>
                <p className="text-sm text-red-700 mt-1">Commercial invoice needed for SH-2024-156</p>
                <Button size="sm" className="mt-2">Upload Now</Button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-lg">🕐</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-900">Shipment Delayed</h4>
                <p className="text-sm text-yellow-700 mt-1">SH-2024-145 delayed by 2 hours</p>
                <Button variant="outline" size="sm" className="mt-2">View Details</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">This Week Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-500">Shipments</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">£156K</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">96%</div>
            <div className="text-xs text-gray-500">On-Time</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">4.8★</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
