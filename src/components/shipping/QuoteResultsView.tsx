import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import LiveRateComparison from './LiveRateComparison';
import { type RateRequest, type CarrierRate } from '@/services/carriers';
import { CO2Badge } from '@/components/ui/co2-badge';
import { LandedCostTool } from '@/components/ui/landed-cost-tool';

interface QuoteResultsViewProps {
    quote: any;
    onBack: () => void;
    onBook?: (rate: any) => void;
}

const QuoteResultsView: React.FC<QuoteResultsViewProps> = ({ quote, onBack, onBook }) => {
    const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);

    if (!quote) return <div className="p-8 text-center text-gray-500">Loading quote results...</div>;

    const rateRequest: RateRequest = {
        origin: {
            street1: '123 Business St',
            city: quote.origin?.split(', ')[0] || 'London',
            state: '',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
        destination: {
            street1: '456 Commerce Ave',
            city: quote.destination?.split(', ')[0] || 'Hamburg',
            state: '',
            zip: '20095',
            country: quote.destination?.includes('DE') ? 'DE' :
                quote.destination?.includes('US') ? 'US' :
                    quote.destination?.includes('CN') ? 'CN' : 'DE',
        },
        parcel: {
            length: parseFloat(quote.dimensions?.length) || 40,
            width: parseFloat(quote.dimensions?.width) || 30,
            height: parseFloat(quote.dimensions?.height) || 20,
            distance_unit: 'cm',
            weight: parseFloat(quote.weight) || 100,
            mass_unit: 'kg',
        },
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎉</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">Booking Request Received!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
                Your quote for <strong>{quote.origin}</strong> to <strong>{quote.destination}</strong> has been successfully submitted.
            </p>

            {quote.selectedRate && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left max-w-md mx-auto mt-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Shipment Summary</h4>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Carrier</span>
                            <span className="font-medium text-slate-900">{quote.selectedRate.carrier}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Service</span>
                            <span className="font-medium text-slate-900">{quote.selectedRate.service}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Transit Time</span>
                            <span className="font-medium text-slate-900">{quote.selectedRate.transit_time}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-3">
                            <span className="text-gray-900 font-semibold">Total Cost</span>
                            <span className="font-bold text-xl text-blue-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.selectedRate.cost)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-8 flex justify-center gap-4">
                <Button variant="outline" onClick={onBack}>
                    Close
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/platform'}>
                    View in Dashboard
                </Button>
            </div>
        </div>
    );
};

export default QuoteResultsView;
