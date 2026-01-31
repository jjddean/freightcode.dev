import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'error':
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
      case 'info':
        return <Info style={{ width: '20px', height: '20px', color: '#3b82f6' }} />;
      default:
        return <Info style={{ width: '20px', height: '20px', color: '#3b82f6' }} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#f0fdf4';
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      case 'info':
        return '#eff6ff';
      default:
        return '#eff6ff';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#3b82f6';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            backgroundColor: getBackgroundColor(notification.type),
            border: `1px solid ${getBorderColor(notification.type)}`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          {getIcon(notification.type)}
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              margin: '0 0 4px 0', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#111827' 
            }}>
              {notification.title}
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: '#6b7280' 
            }}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration = 7000) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration = 6000) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default NotificationSystem;
