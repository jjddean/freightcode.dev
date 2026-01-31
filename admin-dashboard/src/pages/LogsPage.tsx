import React from 'react';
import { FileText } from 'lucide-react';

const LogsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-600">Monitor API usage, webhooks, and automation logs</p>
      </div>
      <div className="admin-card">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Log Monitoring</h3>
          <p className="mt-1 text-sm text-gray-500">View API logs, webhook events, and system activity</p>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
