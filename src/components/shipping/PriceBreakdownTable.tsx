import React from 'react';

export interface LineItem {
    category: string;
    description: string;
    unit: string;
    price: number;
    currency: string;
    minimum?: number;
    total: number;
    vat?: string;
}

interface PriceBreakdownTableProps {
    lineItems?: LineItem[];
    currency?: string;
}

const PriceBreakdownTable: React.FC<PriceBreakdownTableProps> = ({ lineItems, currency = 'USD' }) => {
    if (!lineItems || lineItems.length === 0) return null;

    // Group by category to show logical sections
    const grouped = lineItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, LineItem[]>);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden text-sm shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Service Details</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Unit</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider text-right">Price</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider text-right bg-blue-50/30">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {Object.entries(grouped).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <tr className="bg-gray-50/40">
                                <td colSpan={4} className="px-4 py-1.5 font-bold text-blue-900 uppercase text-[10px] tracking-widest border-y border-gray-100">
                                    {category}
                                </td>
                            </tr>
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-4 py-3 text-gray-700">
                                        <div className="font-medium">{item.description}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.unit}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        {formatCurrency(item.price)}
                                        {item.minimum && (
                                            <div className="text-[9px] text-orange-600 font-medium">Min: {formatCurrency(item.minimum)}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900 bg-blue-50/10 group-hover:bg-blue-50/20">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PriceBreakdownTable;
