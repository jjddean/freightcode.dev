import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Package,
  Shield,
  CreditCard,
  FileText,
  Settings,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Shipments', href: '/admin/shipments', icon: Package },
    { name: 'Compliance', href: '/admin/compliance', icon: Shield },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Manual Actions', href: '/admin/manual', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile sidebar */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: sidebarOpen ? 'block' : 'none'
      }}>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(75, 85, 99, 0.75)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '256px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}>
          <div style={{
            display: 'flex',
            height: '64px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px'
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Admin Dashboard</h1>
            <button onClick={() => setSidebarOpen(false)} style={{ border: 'none', background: 'none' }}>
              <X style={{ height: '24px', width: '24px' }} />
            </button>
          </div>
          <nav style={{ flex: 1, padding: '16px 8px' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    marginBottom: '4px',
                    backgroundColor: isActive ? '#dbeafe' : 'transparent',
                    color: isActive ? '#1e40af' : '#4b5563'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon style={{ marginRight: '12px', height: '20px', width: '20px' }} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200">
          <button
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex w-full md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <span className="text-sm font-medium text-gray-900">MarketLive Admin</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-sm text-gray-500">Administrator</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
