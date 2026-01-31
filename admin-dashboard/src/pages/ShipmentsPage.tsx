import React, { useState } from 'react';
import { Search, Package, Truck, Ship, Plane } from 'lucide-react';

const ShipmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const shipments = [
    {
      id: 'SH-2024-001',
      customer: 'ACME Corporation',
      origin: 'London, UK',
      destination: 'Hamburg, DE',
      status: 'in_transit',
      carrier: 'DHL',
      value: '$12,450',
      created: '2024-08-01',
      eta: '2024-08-03'
    },
    {
      id: 'SH-2024-002',
      customer: 'Global Tech Solutions',
      origin: 'Manchester, UK',
      destination: 'Rotterdam, NL',
      status: 'delivered',
      carrier: 'FedEx',
      value: '$8,750',
      created: '2024-07-28',
      eta: '2024-07-30'
    },
    {
      id: 'SH-2024-003',
      customer: 'Trade & Co',
      origin: 'Birmingham, UK',
      destination: 'Barcelona, ES',
      status: 'pending',
      carrier: 'UPS',
      value: '$15,200',
      created: '2024-08-02',
      eta: '2024-08-05'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="status-badge status-active">Delivered</span>;
      case 'in_transit':
        return <span className="status-badge status-pending">In Transit</span>;
      case 'pending':
        return <span className="status-badge status-inactive">Pending</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Shipments</h1>
        <p className="text-gray-600">Search and manage shipments across all accounts</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="admin-card">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{shipments.length}</div>
              <div className="text-sm text-gray-500">Total Shipments</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'in_transit').length}
              </div>
              <div className="text-sm text-gray-500">In Transit</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-500">Delivered</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments..."
              className="admin-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Customer</th>
                <th>Route</th>
                <th>Carrier</th>
                <th>Value</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <div className="font-medium text-gray-900">{shipment.id}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{shipment.customer}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {shipment.origin} → {shipment.destination}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{shipment.carrier}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">{shipment.value}</div>
                  </td>
                  <td>{getStatusBadge(shipment.status)}</td>
                  <td>
                    <div className="text-sm text-gray-900">{shipment.eta}</div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                        Track
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

export default ShipmentsPage;
