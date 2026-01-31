import React, { useState } from 'react';
import { Settings, Users, Bell, Shield, Database, Mail, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    complianceAlerts: true,
    paymentAlerts: true
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'team', name: 'Team Members', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Database }
  ];

  const teamMembers = [
    { id: 1, name: 'Admin User', email: 'admin@marketlive.com', role: 'Super Admin', status: 'active' },
    { id: 2, name: 'Support Manager', email: 'support@marketlive.com', role: 'Support Admin', status: 'active' },
    { id: 3, name: 'Finance Admin', email: 'finance@marketlive.com', role: 'Finance Admin', status: 'active' }
  ];

  const integrations = [
    { name: 'Shippo API', status: 'connected', lastSync: '2024-08-02 15:30' },
    { name: 'ReachShip API', status: 'connected', lastSync: '2024-08-02 15:28' },
    { name: 'EasyShip API', status: 'error', lastSync: '2024-08-02 12:15' },
    { name: 'Stripe Payments', status: 'connected', lastSync: '2024-08-02 15:32' },
    { name: 'Email Service', status: 'connected', lastSync: '2024-08-02 15:25' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
                General Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Company Name
                  </label>
                  <input className="admin-input" defaultValue="MarketLive" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Admin Email
                  </label>
                  <input className="admin-input" defaultValue="admin@marketlive.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Time Zone
                  </label>
                  <select className="admin-input">
                    <option>UTC (GMT+0)</option>
                    <option>London (GMT+1)</option>
                    <option>New York (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Team Members
              </h3>
              <button className="admin-button">Add Member</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: '500' }}>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.role}</td>
                      <td>
                        <span className="status-badge status-active">
                          {member.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="admin-button-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                            Edit
                          </button>
                          <button className="admin-button-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Notification Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Receive notifications for {key.toLowerCase().replace('alerts', '')} events
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: value ? '#2563eb' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '34px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '26px',
                        width: '26px',
                        left: value ? '30px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Security Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#111827' }}>Two-Factor Authentication</h4>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                  Add an extra layer of security to your account
                </p>
                <button className="admin-button">Enable 2FA</button>
              </div>
              <div className="admin-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#111827' }}>Session Management</h4>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                  Manage active sessions and login history
                </p>
                <button className="admin-button-secondary">View Sessions</button>
              </div>
              <div className="admin-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#111827' }}>API Keys</h4>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                  Manage API keys for system integrations
                </p>
                <button className="admin-button-secondary">Manage Keys</button>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              System Integrations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {integrations.map((integration, index) => (
                <div key={index} className="admin-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#111827' }}>{integration.name}</h4>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        Last sync: {integration.lastSync}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`status-badge ${
                        integration.status === 'connected' ? 'status-active' : 
                        integration.status === 'error' ? 'status-inactive' : 'status-pending'
                      }`}>
                        {integration.status}
                      </span>
                      <button className="admin-button-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Manage admin panel settings, team members, and integrations</p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{ width: '240px' }}>
          <div className="admin-card" style={{ padding: '8px' }}>
            <nav>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: activeTab === tab.id ? '#dbeafe' : 'transparent',
                      color: activeTab === tab.id ? '#1e40af' : '#4b5563',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      textAlign: 'left'
                    }}
                  >
                    <Icon style={{ marginRight: '12px', height: '16px', width: '16px' }} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div className="admin-card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
