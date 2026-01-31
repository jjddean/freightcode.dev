import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CommercialInvoiceTemplate } from '@/components/documents/templates/CommercialInvoiceTemplate';
import { BillOfLadingTemplate } from '@/components/documents/templates/BillOfLadingTemplate';
import { AirWaybillTemplate } from '@/components/documents/templates/AirWaybillTemplate';

const DocumentPrintPage = () => {
    const { documentId } = useParams();
    // Fetch document details
    // We reuse listMyDocuments and filter, strictly we should have a getDocument query but this works
    const documents = useQuery(api.documents.listMyDocuments, {});

    // Find local doc or null (loading)
    const doc = documents?.find((d: any) => d._id === documentId);

    useEffect(() => {
        if (doc) {
            document.title = `${doc.documentData?.documentNumber || 'Document'} - Print View`;
            // Optional: Auto-print
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, [doc]);

    if (!documents) return <div className="p-10 font-bold">Loading document...</div>;
    if (!doc) return <div className="p-10 text-red-600 font-bold">Document not found or access denied.</div>;

    const type = doc.type;

    return (
        <div className="print-container bg-gray-200 min-h-screen p-8 print:p-0 print:bg-white">
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .print-container { padding: 0; background: white; min-h: 0; }
                    /* Hide everything else if not isolated, but this is a dedicated page */
                }
            `}</style>

            <div className="mb-4 text-center print:hidden">
                <p className="text-gray-600 mb-2">Printing <strong>{doc.documentData?.documentNumber}</strong></p>
                <div className="space-x-4">
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Print PDF</button>
                    <button onClick={() => window.close()} className="bg-gray-300 px-4 py-2 rounded">Close</button>
                </div>
            </div>

            <div className="bg-white shadow-lg mx-auto print:shadow-none print:w-full">
                {type === 'commercial_invoice' && <CommercialInvoiceTemplate data={doc} />}
                {type === 'bill_of_lading' && <BillOfLadingTemplate data={doc} />}
                {type === 'air_waybill' && <AirWaybillTemplate data={doc} />}
                {/* Fallback */}
                {(!['commercial_invoice', 'bill_of_lading', 'air_waybill'].includes(type)) && (
                    <div className="p-10 text-center">
                        <h1 className="text-2xl font-bold">Unknown Document Type</h1>
                        <pre className="text-left bg-gray-100 p-4 rounded mt-4 overflow-auto">
                            {JSON.stringify(doc, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentPrintPage;
