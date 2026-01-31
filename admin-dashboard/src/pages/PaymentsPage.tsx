import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Invoices</h1>
        <p className="text-gray-600">Override quotes, payments, and invoice management</p>
      </div>
      <div className="admin-card">
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Payment Management</h3>
          <p className="mt-1 text-sm text-gray-500">View invoices, process payments, and override quotes</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
