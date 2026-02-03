import React, { useState, useEffect, useRef, useMemo } from 'react';
// @ts-ignore
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
// @ts-ignore
import type { MapRef } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Search, Plane, Ship, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';



// --- GEOLOCATION MOCK ---
const PORTS: Record<string, [number, number]> = {
    'London': [-0.1278, 51.5074],
    'New York': [-74.0060, 40.7128],
    'Shanghai': [121.4737, 31.2304],
    'Singapore': [103.8198, 1.3521],
    'Dubai': [55.2708, 25.2048],
    'Los Angeles': [-118.2437, 34.0522],
    'Hamburg': [9.9937, 53.5511],
    'Mumbai': [72.8777, 19.0760]
};

interface VisualQuoteInputProps {
    onSearch: (data: { origin: string; destination: string }) => void;
}

export const VisualQuoteInput: React.FC<VisualQuoteInputProps> = ({ onSearch }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [searching, setSearching] = useState(false);
    const mapRef = useRef<MapRef>(null);

    // Coordinates (Longitude, Latitude for Mapbox)
    const coordsOrigin = useMemo(() =>
        PORTS[Object.keys(PORTS).find(k => k.toLowerCase() === origin.toLowerCase()) || ''],
        [origin]);

    const coordsDest = useMemo(() =>
        PORTS[Object.keys(PORTS).find(k => k.toLowerCase() === destination.toLowerCase()) || ''],
        [destination]);

    // Handle Viewport Animation
    useEffect(() => {
        if (mapRef.current && coordsOrigin && coordsDest) {
            // Fit bounds to show both points with padding
            const bounds = new mapboxgl.LngLatBounds(
                coordsOrigin,
                coordsDest
            );

            mapRef.current.fitBounds(bounds, {
                padding: 100,
                duration: 2000,
                pitch: 45 // 3D effect
            });
        } else if (mapRef.current && coordsOrigin) {
            mapRef.current.flyTo({
                center: coordsOrigin,
                zoom: 4,
                duration: 1500
            });
        }
    }, [coordsOrigin, coordsDest]);

    const handleSearch = () => {
        if (!origin || !destination) {
            toast.error("Please enter both Origin and Destination");
            return;
        }

        setSearching(true);
        // Simulate "calculating routes"
        setTimeout(() => {
            setSearching(false);
            onSearch({ origin, destination });
        }, 1500);
    };

    // GeoJSON for the Route Line (Great Circle approximation would be better, but straight line for MVP)
    const routeGeoJSON = useMemo(() => {
        if (!coordsOrigin || !coordsDest) return null;
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [coordsOrigin, coordsDest]
            }
        } as any;
    }, [coordsOrigin, coordsDest]);

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!MAPBOX_TOKEN) {
        return <div className="p-12 text-center text-red-500">Missing VITE_MAPBOX_TOKEN</div>;
    }

    return (
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-900">
            {/* 1. The Interactive Map Background */}
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: -20,
                    latitude: 30,
                    zoom: 1.5,
                    pitch: 0
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11" // Premium Dark Mode
                mapboxAccessToken={MAPBOX_TOKEN}
                projection={{ name: 'globe' }} // Ensure 3D globe projection
                fog={{
                    "range": [0.5, 10],
                    "color": "#242B4B",
                    "high-color": "#161B33",
                    "space-color": "#0B1026"
                }}
            >
                {/* Visual Markers */}
                {coordsOrigin && (
                    <Marker longitude={coordsOrigin[0]} latitude={coordsOrigin[1]} anchor="bottom">
                        <div className="relative">
                            <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_#003366]"></div>
                            <div className="absolute top-0 left-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-75"></div>
                        </div>
                    </Marker>
                )}

                {coordsDest && (
                    <Marker longitude={coordsDest[0]} latitude={coordsDest[1]} anchor="bottom">
                        <div className="relative">
                            <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_#14b8a6]"></div>
                            <div className="absolute top-0 left-0 w-4 h-4 bg-secondary rounded-full animate-ping opacity-75"></div>
                        </div>
                    </Marker>
                )}

                {/* Route Line Layer */}
                {routeGeoJSON && (
                    <Source id="route" type="geojson" data={routeGeoJSON}>
                        <Layer
                            id="route-layer"
                            type="line"
                            layout={{
                                "line-join": "round",
                                "line-cap": "round"
                            }}
                            paint={{
                                "line-color": "#003366", // Brand Primary (Navy)
                                "line-width": 4,
                                "line-dasharray": [2, 1],
                                "line-opacity": 0.8
                            }}
                        />
                    </Source>
                )}
            </Map>

            {/* 2. Floating Glassmorphism Input Bar */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-10 px-4">
                <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-white/40 space-y-4">
                    <div className="text-center mb-1">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Where are you shipping?</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Instant Multi-Modal Quotes</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch relative">
                        {/* Origin */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse shadow-sm"></div>
                            </div>
                            <input
                                type="text"
                                list="ports"
                                className="block w-full pl-7 pr-3 py-2.5 text-sm font-medium border border-gray-200 bg-white/50 focus:bg-white rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm placeholder:text-gray-400"
                                placeholder="Origin city"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            />
                        </div>

                        {/* Connector Arrow */}
                        <div className="hidden sm:flex items-center text-slate-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>

                        {/* Destination */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="h-1.5 w-1.5 bg-secondary rounded-full shadow-sm"></div>
                            </div>
                            <input
                                type="text"
                                list="ports"
                                className="block w-full pl-7 pr-3 py-2.5 text-sm font-medium border border-gray-200 bg-white/50 focus:bg-white rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm placeholder:text-gray-400"
                                placeholder="Destination city"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Action Button & Toggles */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        {/* Quick Mode Selectors */}
                        <div className="flex gap-4 text-xs font-medium text-slate-500 order-2 sm:order-1">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                                <Ship className="w-3.5 h-3.5 text-primary" />
                                <span>Ocean</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                                <Plane className="w-3.5 h-3.5 text-secondary" />
                                <span>Air</span>
                            </div>
                        </div>

                        {/* Search Button */}
                        <Button
                            size="sm"
                            className="w-full sm:w-auto h-9 px-6 text-sm font-semibold bg-primary hover:bg-primary-700 shadow-md shadow-primary/10 transition-all hover:scale-[1.01] order-1 sm:order-2"
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching ? (
                                <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Check Rates</>
                            ) : (
                                <><Search className="w-3.5 h-3.5 mr-2" /> Search Rates</>
                            )}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Datalist for Autocomplete Mock */}
            <datalist id="ports">
                {Object.keys(PORTS).map(port => (
                    <option key={port} value={port} />
                ))}
            </datalist>

        </div>
    );
};
