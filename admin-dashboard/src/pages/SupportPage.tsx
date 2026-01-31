import React, { useState } from 'react';
import { Search, MessageCircle, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tickets = [
    {
      id: 'TK-2024-001',
      customer: 'John Smith',
      company: 'ACME Corporation',
      subject: 'Shipment tracking not updating',
      status: 'open',
      priority: 'high',
      created: '2024-08-02 09:15',
      lastReply: '2024-08-02 14:30',
      messages: 3
    },
    {
      id: 'TK-2024-002',
      customer: 'Sarah Johnson',
      company: 'Global Tech Solutions',
      subject: 'Invoice discrepancy for July shipments',
      status: 'pending',
      priority: 'medium',
      created: '2024-08-01 16:45',
      lastReply: '2024-08-02 08:20',
      messages: 5
    },
    {
      id: 'TK-2024-003',
      customer: 'Michael Chen',
      company: 'UK Logistics Ltd',
      subject: 'API integration assistance needed',
      status: 'resolved',
      priority: 'low',
      created: '2024-07-30 11:20',
      lastReply: '2024-08-01 15:45',
      messages: 8
    },
    {
      id: 'TK-2024-004',
      customer: 'Emma Wilson',
      company: 'Trade & Co',
      subject: 'Customs documentation missing',
      status: 'open',
      priority: 'high',
      created: '2024-08-02 13:10',
      lastReply: '2024-08-02 13:10',
      messages: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>Open</span>;
      case 'pending':
        return <span className="status-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>Pending</span>;
      case 'resolved':
        return <span className="status-badge status-active">Resolved</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="status-badge status-inactive">High</span>;
      case 'medium':
        return <span className="status-badge status-pending">Medium</span>;
      case 'low':
        return <span className="status-badge" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>Low</span>;
      default:
        return <span className="status-badge">{priority}</span>;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          Support Tickets
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Handle customer support requests and manual help tickets</p>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MessageCircle style={{ height: '32px', width: '32px', color: '#2563eb' }} />
            <div style={{ marginLeft: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {tickets.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Tickets</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Clock style={{ height: '32px', width: '32px', color: '#f59e0b' }} />
            <div style={{ marginLeft: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Open</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle style={{ height: '32px', width: '32px', color: '#3b82f6' }} />
            <div style={{ marginLeft: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {tickets.filter(t => t.status === 'pending').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle style={{ height: '32px', width: '32px', color: '#10b981' }} />
            <div style={{ marginLeft: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="Search tickets..."
                className="admin-input"
                style={{ paddingLeft: '40px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="admin-input"
              style={{ width: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <div style={{ fontWeight: '500', color: '#111827' }}>{ticket.id}</div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{ticket.customer}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{ticket.company}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{ticket.subject}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Last reply: {ticket.lastReply}
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>
                    <div style={{ fontSize: '14px', color: '#111827' }}>{ticket.created}</div>
                  </td>
                  <td>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontSize: '14px', 
                      color: '#111827' 
                    }}>
                      <MessageCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                      {ticket.messages}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="admin-button"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        View
                      </button>
                      <button 
                        className="admin-button-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Reply
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

export default SupportPage;
