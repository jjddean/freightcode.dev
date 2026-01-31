import React from 'react';

export const CommercialInvoiceTemplate = ({ data }: { data: any }) => {
    const doc = data.documentData || {};
    const parties = doc.parties || {};
    const items = doc.items || [doc.cargoDetails]; // Fallback if items not array

    return (
        <div className="max-w-[210mm] mx-auto bg-white text-black p-10 font-sans text-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-900 pb-2 inline-block">COMMERCIAL INVOICE</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800">#{doc.documentNumber}</h2>
                    <p className="text-gray-500">Date: {doc.issueDate}</p>
                </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">Shipper / Exporter</h3>
                    <div className="font-bold text-lg">{parties.shipper?.name}</div>
                    <div className="text-gray-600 whitespace-pre-wrap mt-1">{parties.shipper?.address}</div>
                </div>
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">Consignee</h3>
                    <div className="font-bold text-lg">{parties.consignee?.name}</div>
                    <div className="text-gray-600 whitespace-pre-wrap mt-1">{parties.consignee?.address}</div>
                </div>
            </div>

            {/* Details Bar */}
            <div className="bg-gray-50 p-4 border-y border-gray-200 grid grid-cols-4 gap-4 mb-10">
                <div>
                    <span className="block text-xs text-gray-500 uppercase">Origin</span>
                    <span className="font-medium">{doc.routeDetails?.origin}</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-500 uppercase">Destination</span>
                    <span className="font-medium">{doc.routeDetails?.destination}</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-500 uppercase">Incoterms</span>
                    <span className="font-medium">{doc.terms || "EXW"}</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-500 uppercase">Currency</span>
                    <span className="font-medium">USD</span>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-800 text-left">
                        <th className="py-2 w-16">Qty</th>
                        <th className="py-2">Description</th>
                        <th className="py-2 text-right">Unit Weight</th>
                        <th className="py-2 text-right">Unit Value</th>
                        <th className="py-2 text-right">Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any, i: number) => (
                        <tr key={i} className="border-b border-gray-200">
                            <td className="py-3 align-top">1</td>
                            <td className="py-3 align-top">
                                <div className="font-bold">{item.description}</div>
                                <div className="text-xs text-gray-500 mt-1">HS Code: 9999.99</div>
                            </td>
                            <td className="py-3 align-top text-right">{item.weight}</td>
                            <td className="py-3 align-top text-right">{item.value || "0.00"}</td>
                            <td className="py-3 align-top text-right font-medium">{item.value || "0.00"}</td>
                        </tr>
                    ))}
                    {/* Filler rows */}
                    <tr className="h-24"><td></td><td></td><td></td><td></td><td></td></tr>
                </tbody>
                <tfoot>
                    <tr className="border-t-2 border-gray-800">
                        <td colSpan={3}></td>
                        <td className="py-4 text-right font-bold text-gray-600">Total:</td>
                        <td className="py-4 text-right font-bold text-xl">{doc.cargoDetails?.value || "0.00"}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Signature */}
            <div className="mt-16 flex justify-end">
                <div className="w-64 border-t border-black pt-2 text-center">
                    <p className="font-bold mb-8">Authorized Signature</p>
                    <p className="text-xs text-gray-500">I declare that all information contained in this invoice to be true and correct.</p>
                </div>
            </div>
        </div>
    );
};
