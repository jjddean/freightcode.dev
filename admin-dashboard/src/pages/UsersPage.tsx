import React, { useState } from 'react';
import { Search, Filter, UserCheck, UserX, Mail, Building } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@acmecorp.com',
      company: 'ACME Corporation',
      status: 'active',
      role: 'freight_client',
      joinDate: '2024-01-15',
      lastLogin: '2024-08-01',
      shipmentsCount: 47
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@globaltech.com',
      company: 'Global Tech Solutions',
      status: 'pending',
      role: 'freight_client',
      joinDate: '2024-07-28',
      lastLogin: 'Never',
      shipmentsCount: 0
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'mchen@logistics.co.uk',
      company: 'UK Logistics Ltd',
      status: 'suspended',
      role: 'freight_client',
      joinDate: '2023-11-20',
      lastLogin: '2024-07-15',
      shipmentsCount: 156
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.wilson@tradeco.com',
      company: 'Trade & Co',
      status: 'active',
      role: 'freight_client',
      joinDate: '2024-03-10',
      lastLogin: '2024-08-02',
      shipmentsCount: 23
    },
    {
      id: 5,
      name: 'David Rodriguez',
      email: 'david.r@importexport.es',
      company: 'Import Export España',
      status: 'pending',
      role: 'freight_client',
      joinDate: '2024-08-01',
      lastLogin: 'Never',
      shipmentsCount: 0
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveUser = (userId: number) => {
    console.log('Approving user:', userId);
    // Implementation would update user status
  };

  const handleSuspendUser = (userId: number) => {
    console.log('Suspending user:', userId);
    // Implementation would suspend user
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Active</span>;
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'suspended':
        return <span className="status-badge status-inactive">Suspended</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage freight client access and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="admin-card">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending Approval</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'suspended').length}
              </div>
              <div className="text-sm text-gray-500">Suspended</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="admin-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="admin-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Company</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Shipments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{user.company}</div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    <div className="text-sm text-gray-900">{user.joinDate}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{user.lastLogin}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{user.shipmentsCount}</div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
