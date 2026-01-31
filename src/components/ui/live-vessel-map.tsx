import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ship, Anchor, Navigation, Wind, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LiveVesselMap = ({ shipmentId, origin, destination, progress = 0 }: { shipmentId: string; origin: string; destination: string; progress?: number }) => {
    // Determine random start/end coordinates for visual simulation
    // This is "Mocking" a real Mapbox implementation for the demo
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        // Animate the progress bar on mount
        const timer = setTimeout(() => {
            setAnimatedProgress(progress || 45); // Default to 45% if unknown
        }, 500);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <Card className="w-full overflow-hidden border-slate-200 shadow-lg bg-white">
            <div className="relative h-64 w-full bg-slate-900 overflow-hidden group">
                {/* Ocean Background Animation */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Map Grid overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {/* Simulated Path Line */}
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-700/50"></div>

                {/* Origin Dot */}
                <div className="absolute top-1/2 left-10 transform -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">{origin.split(',')[0]}</div>
                </div>

                {/* Destination Dot */}
                <div className="absolute top-1/2 right-10 transform -translate-y-1/2 flex flex-col items-center group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-slate-600 rounded-full border border-slate-500"></div>
                    <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">{destination.split(',')[0]}</div>
                </div>

                {/* The Vessel (animated via style left%) */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-10"
                    style={{ left: `calc(2.5rem + (100% - 5rem) * ${animatedProgress / 100})` }}
                >
                    <div className="relative">
                        {/* Pulse Effect */}
                        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ping"></div>
                        <div className="absolute -inset-2 bg-emerald-500/30 rounded-full animate-pulse"></div>

                        {/* Ship Icon */}
                        <div className="relative bg-emerald-500 p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-slate-900">
                            <Ship className="w-5 h-5 text-slate-900 fill-slate-900" />
                        </div>

                        {/* Info Tooltip (Always visible for demo) */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl border border-slate-700">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                <span>18.4 kts</span>
                            </div>
                            <div className="text-slate-400 text-[10px] mt-0.5">Heading 270° W</div>
                            {/* Triangle arrow down */}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-b border-r border-slate-700"></div>
                        </div>
                    </div>
                </div>

            </div>

            <CardContent className="p-4 bg-slate-50 grid grid-cols-3 divide-x divide-slate-200">
                <div className="px-4 first:pl-0 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium uppercase">Distance</div>
                        <div className="text-sm font-bold text-slate-900">4,230 NM</div>
                    </div>
                </div>
                <div className="px-4 flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                        <Wind className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium uppercase">Weather</div>
                        <div className="text-sm font-bold text-slate-900">Fair / 12kts</div>
                    </div>
                </div>
                <div className="px-4 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Waves className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-medium uppercase">Draft</div>
                        <div className="text-sm font-bold text-slate-900">14.2m</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
