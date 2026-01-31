import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarrierStatus {
  name: string;
  provider: string;
  status: 'online' | 'offline' | 'degraded';
  lastCheck: string;
  responseTime: number;
  successRate: number;
  apiCalls: number;
  errors: number;
}

interface ApiUsage {
  provider: string;
  callsToday: number;
  limit: number;
  resetTime: string;
}

const CarrierIntegrationDashboard: React.FC = () => {
  const [carrierStatuses, setCarrierStatuses] = useState<CarrierStatus[]>([]);
  const [apiUsage, setApiUsage] = useState<ApiUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for carrier statuses
    const mockStatuses: CarrierStatus[] = [
      {
        name: 'Shippo Multi-Carrier',
        provider: 'shippo',
        status: 'online',
        lastCheck: new Date().toISOString(),
        responseTime: 245,
        successRate: 99.2,
        apiCalls: 1247,
        errors: 3,
      },
      {
        name: 'ReachShip API',
        provider: 'reachship',
        status: 'online',
        lastCheck: new Date().toISOString(),
        responseTime: 312,
        successRate: 97.8,
        apiCalls: 892,
        errors: 8,
      },
      {
        name: 'EasyShip API',
        provider: 'easyship',
        status: 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime: 1240,
        successRate: 94.5,
        apiCalls: 634,
        errors: 15,
      },
      {
        name: 'FedEx Direct API',
        provider: 'fedex',
        status: 'offline',
        lastCheck: new Date(Date.now() - 300000).toISOString(),
        responseTime: 0,
        successRate: 0,
        apiCalls: 0,
        errors: 12,
      },
    ];

    const mockUsage: ApiUsage[] = [
      {
        provider: 'Shippo',
        callsToday: 247,
        limit: 1000,
        resetTime: '2024-08-02T00:00:00Z',
      },
      {
        provider: 'ReachShip',
        callsToday: 89,
        limit: 500,
        resetTime: '2024-08-02T00:00:00Z',
      },
      {
        provider: 'EasyShip',
        callsToday: 156,
        limit: 300,
        resetTime: '2024-08-02T00:00:00Z',
      },
    ];

    setCarrierStatuses(mockStatuses);
    setApiUsage(mockUsage);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCarrierStatuses(prev => prev.map(status => ({
        ...status,
        lastCheck: new Date().toISOString(),
        responseTime: status.status === 'online' ? 
          Math.floor(Math.random() * 500) + 200 : status.responseTime,
        apiCalls: status.status === 'online' ? 
          status.apiCalls + Math.floor(Math.random() * 3) : status.apiCalls,
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '✅';
      case 'degraded': return '⚠️';
      case 'offline': return '❌';
      default: return '❓';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Carrier API Status</h2>
            <p className="text-sm text-gray-600">Monitor live carrier integrations and API health</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Carrier Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carrierStatuses.map((carrier, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(carrier.status)}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{carrier.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(carrier.status)}`}>
                    {carrier.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Last Check</div>
                <div className="text-sm font-medium">{formatTime(carrier.lastCheck)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Response Time</div>
                <div className="font-medium">{carrier.responseTime}ms</div>
              </div>
              <div>
                <div className="text-gray-500">Success Rate</div>
                <div className="font-medium">{carrier.successRate}%</div>
              </div>
              <div>
                <div className="text-gray-500">API Calls</div>
                <div className="font-medium">{carrier.apiCalls.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Errors</div>
                <div className="font-medium text-red-600">{carrier.errors}</div>
              </div>
            </div>

            {carrier.status === 'offline' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">⚠️</span>
                  <span className="text-sm text-red-700">API endpoint unreachable</span>
                </div>
              </div>
            )}

            {carrier.status === 'degraded' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span className="text-sm text-yellow-700">Slow response times detected</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* API Usage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Usage Today</h3>
        <div className="space-y-4">
          {apiUsage.map((usage, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="font-medium text-gray-900">{usage.provider}</div>
                <div className="text-sm text-gray-500">
                  {usage.callsToday} / {usage.limit} calls
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all",
                      usage.callsToday / usage.limit > 0.8 ? "bg-red-500" :
                      usage.callsToday / usage.limit > 0.6 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${Math.min((usage.callsToday / usage.limit) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-sm font-medium">
                  {Math.round((usage.callsToday / usage.limit) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <span className="mr-2">🔄</span>
            Refresh All Status
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">📊</span>
            View Analytics
          </Button>
          <Button variant="outline" className="justify-start">
            <span className="mr-2">⚙️</span>
            API Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarrierIntegrationDashboard;
