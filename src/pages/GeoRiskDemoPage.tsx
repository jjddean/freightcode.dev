import React from 'react';
import { GeoRiskNavigator } from '@/components/ai/GeoRiskNavigator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Demo scenarios with different risk levels
const DEMO_SCENARIOS = {
    lowRisk: {
        route: 'London → Rotterdam',
        data: {
            score: 15,
            level: 'LOW' as const,
            advisory: 'Route appears stable. Standard procedures apply.',
            factors: {
                zone: {
                    score: 10,
                    weight: 0.4,
                    details: []
                },
                sanctions: {
                    score: 0,
                    weight: 0.4,
                    details: [],
                    available: true
                },
                weather: {
                    score: 5,
                    weight: 0.2,
                    details: {
                        description: 'clear sky',
                        windSpeed: 5,
                        visibility: 10000,
                        temp: 15,
                        factors: []
                    },
                    available: true
                }
            },
            premium: true,
            lastUpdated: Date.now()
        }
    },
    mediumRisk: {
        route: 'Mumbai → Rotterdam (via Suez)',
        data: {
            score: 68,
            level: 'MEDIUM' as const,
            advisory: 'Elevated risk factors detected. Review routing options and prepare contingency plans where applicable.',
            factors: {
                zone: {
                    score: 55,
                    weight: 0.4,
                    details: [
                        'Transit via Suez Canal - elevated maritime risk',
                        'Destination region has moderate geopolitical instability'
                    ]
                },
                sanctions: {
                    score: 0,
                    weight: 0.4,
                    details: [],
                    available: true
                },
                weather: {
                    score: 15,
                    weight: 0.2,
                    details: {
                        description: 'light rain',
                        windSpeed: 12,
                        visibility: 8000,
                        temp: 18,
                        factors: ['Moderate winds (12 m/s)']
                    },
                    available: true
                }
            },
            premium: true,
            lastUpdated: Date.now()
        }
    },
    highRisk: {
        route: 'Dubai → Tehran',
        data: {
            score: 88,
            level: 'HIGH' as const,
            advisory: 'Significant risk factors detected. Consider alternative routing, additional insurance, or enhanced due diligence before proceeding.',
            factors: {
                zone: {
                    score: 80,
                    weight: 0.4,
                    details: [
                        'Destination (Iran) is under sanctions',
                        'Transit via Strait of Hormuz - elevated maritime risk',
                        'Destination region has active geopolitical tensions'
                    ]
                },
                sanctions: {
                    score: 35,
                    weight: 0.4,
                    details: [
                        {
                            party: 'Sample Shipping Co.',
                            matched: true,
                            entities: [{
                                name: 'Sample Shipping Co.',
                                type: 'LegalEntity',
                                source: 'OFAC, EU',
                                score: 0.95
                            }]
                        }
                    ],
                    available: true
                },
                weather: {
                    score: 25,
                    weight: 0.2,
                    details: {
                        description: 'dust storm',
                        windSpeed: 25,
                        visibility: 2000,
                        temp: 42,
                        factors: ['Strong winds (25 m/s)', 'Low visibility']
                    },
                    available: true
                }
            },
            premium: true,
            lastUpdated: Date.now()
        }
    },
    freeTier: {
        route: 'Shanghai → Los Angeles',
        data: {
            score: 45,
            level: 'MEDIUM' as const,
            advisory: 'Upgrade to Business or Enterprise for comprehensive risk analysis including sanctions screening and weather impact assessment.',
            factors: {
                zone: {
                    score: 45,
                    weight: 0.4,
                    details: ['Transit via South China Sea - elevated maritime risk']
                },
                sanctions: { score: 0, weight: 0.4, details: [], available: false },
                weather: { score: 0, weight: 0.2, details: null, available: false }
            },
            premium: false,
            lastUpdated: Date.now()
        }
    }
};

// Environment flag for internal/dev mode
const IS_DEV_MODE = import.meta.env.DEV;

export default function GeoRiskDemoPage() {
    const [selectedScenario, setSelectedScenario] = React.useState<keyof typeof DEMO_SCENARIOS>('mediumRisk');
    const generateFlow = useMutation(api.simulation.generateFullFlow);
    const moveShipments = useMutation(api.simulation.moveShipments);
    const [simulating, setSimulating] = React.useState(false);
    const [moving, setMoving] = React.useState(false);

    const runSimulation = async () => {
        setSimulating(true);
        try {
            const result = await generateFlow({});
            toast.success("Simulation Complete", { description: result.message });
        } catch (e: any) {
            toast.error("Simulation Failed", { description: e.message });
        } finally {
            setSimulating(false);
        }
    };

    const runMovement = async () => {
        setMoving(true);
        try {
            const result = await moveShipments({});
            toast.success("Movement Complete", { description: result });
        } catch (e: any) {
            toast.error("Movement Failed", { description: e.message });
        } finally {
            setMoving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header - Dashboard Style */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        GeoRisk Navigator™
                    </h1>
                    <p className="text-sm text-slate-400">
                        Route-level geopolitical and compliance risk indicators for freight operations
                    </p>
                </div>

                {/* Prospect-facing banner (subtle, professional) */}
                <div className="mb-6 bg-slate-900 border border-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-400 text-center">
                        Preview scenario based on representative trade lane conditions.
                    </p>
                </div>

                {/* Scenario Selector */}
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
                    <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                        Select Scenario
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(DEMO_SCENARIOS).map(([key, scenario]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedScenario(key as keyof typeof DEMO_SCENARIOS)}
                                className={`p-3 rounded-lg border-2 transition-all ${selectedScenario === key
                                    ? 'border-blue-500 bg-blue-950'
                                    : 'border-slate-700 hover:border-slate-600 bg-slate-800'
                                    }`}
                            >
                                <div className="text-xs font-semibold text-white mb-1">
                                    {key === 'lowRisk' && '✓ Low Risk'}
                                    {key === 'mediumRisk' && '⚠ Medium Risk'}
                                    {key === 'highRisk' && '⛔ High Risk'}
                                    {key === 'freeTier' && '🔒 Basic View'}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {scenario.route}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* GeoRisk Component */}
                <GeoRiskNavigator
                    route={DEMO_SCENARIOS[selectedScenario].route}
                    data={DEMO_SCENARIOS[selectedScenario].data}
                />

                {/* Footer note (very subtle, enterprise-safe) */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-600">
                        Risk indicators shown are illustrative and updated periodically.
                    </p>
                </div>

                {/* DEV MODE ONLY: Internal debug panel */}
                {IS_DEV_MODE && (
                    <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-amber-900 mb-2">
                            🔧 DEV MODE ONLY (Hidden in Production)
                        </h3>
                        <p className="text-xs text-amber-700 leading-relaxed mb-3">
                            This panel is only visible in development. It will not appear in production builds.
                        </p>
                        <div className="bg-white rounded p-3">
                            <p className="text-xs text-amber-600 font-medium mb-2">Simulation Controls:</p>
                            <div className="space-y-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full justify-start h-8 text-xs bg-white border-amber-200 hover:bg-amber-50 text-amber-900"
                                    onClick={() => runSimulation()}
                                    disabled={simulating}
                                >
                                    {simulating ? 'Running...' : '▶ Run Data Generator (Quote + Booking)'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full justify-start h-8 text-xs bg-white border-amber-200 hover:bg-amber-50 text-amber-900"
                                    onClick={() => runMovement()}
                                    disabled={moving}
                                >
                                    {moving ? 'Moving...' : '🚢 Jitter Shipments (5-10km)'}
                                </Button>
                            </div>
                            <div className="mt-3 text-[10px] text-amber-700">
                                Checks active org: {JSON.stringify(api.simulation.generateFullFlow ? 'Connected' : 'Missing')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
