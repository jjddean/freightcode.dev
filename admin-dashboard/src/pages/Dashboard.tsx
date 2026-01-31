import React from 'react';
import { Users, Package, AlertTriangle, DollarSign, Activity, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-600' },
    { name: 'Active Shipments', value: '1,234', change: '+8%', icon: Package, color: 'text-green-600' },
    { name: 'Compliance Flags', value: '23', change: '-15%', icon: AlertTriangle, color: 'text-red-600' },
    { name: 'Revenue (MTD)', value: '$847K', change: '+23%', icon: DollarSign, color: 'text-purple-600' },
  ];

  const recentActivity = [
    { id: 1, type: 'user', message: 'New user registration: john.doe@company.com', time: '2 minutes ago' },
    { id: 2, type: 'shipment', message: 'Shipment SH-2024-001 flagged for compliance review', time: '5 minutes ago' },
    { id: 3, type: 'payment', message: 'Payment processed: $12,450 for invoice INV-2024-0234', time: '12 minutes ago' },
    { id: 4, type: 'system', message: 'API rate limit exceeded for carrier integration', time: '18 minutes ago' },
    { id: 5, type: 'user', message: 'User access revoked: suspended.user@company.com', time: '25 minutes ago' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Overview of system activity and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <Icon style={{ height: '32px', width: '32px' }} className={stat.color} />
                </div>
                <div style={{ marginLeft: '20px', flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                    {stat.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                      {stat.value}
                    </div>
                    <div style={{
                      marginLeft: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: stat.change.startsWith('+') ? '#059669' : '#dc2626'
                    }}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="admin-button-secondary text-left p-4">
            <Users className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Approve User</div>
            <div className="text-xs text-gray-500">Review pending registrations</div>
          </button>
          <button className="admin-button-secondary text-left p-4">
            <Package className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Override Quote</div>
            <div className="text-xs text-gray-500">Manually adjust pricing</div>
          </button>
          <button className="admin-button-secondary text-left p-4">
            <AlertTriangle className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Review Compliance</div>
            <div className="text-xs text-gray-500">Check flagged shipments</div>
          </button>
          <button className="admin-button-secondary text-left p-4">
            <Activity className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Trigger Workflow</div>
            <div className="text-xs text-gray-500">Manual process execution</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivity.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== recentActivity.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                        <Activity className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">{activity.message}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="admin-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">API Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shippo API</span>
              <span className="status-badge status-active">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ReachShip API</span>
              <span className="status-badge status-active">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">EasyShip API</span>
              <span className="status-badge status-pending">Degraded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stripe Payments</span>
              <span className="status-badge status-active">Online</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="text-sm font-medium text-gray-900">245ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-gray-900">99.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily API Calls</span>
              <span className="text-sm font-medium text-gray-900">12,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-gray-900">0.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
