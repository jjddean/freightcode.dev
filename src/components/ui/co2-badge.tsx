import React from 'react';
import { Leaf } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CO2BadgeProps {
    kg: number;
    className?: string;
}

export const CO2Badge = ({ kg, className = "" }: CO2BadgeProps) => {
    // Simple "Offset" calculation logic for demo
    const offsetCost = (kg * 0.02).toFixed(2);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-help transition-colors hover:bg-emerald-100 ${className}`}>
                        <Leaf className="w-3.5 h-3.5 fill-emerald-700" />
                        <span className="text-xs font-semibold">{kg} kg CO₂e</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-slate-800">
                    <div className="text-xs space-y-1">
                        <p className="font-semibold">Carbon Footprint Impact</p>
                        <p className="text-slate-300">Offset this shipment for approx <span className="text-emerald-400 font-mono">${offsetCost}</span></p>
                        <p className="text-[10px] text-slate-500 mt-1">Calculated via GLEC Framework</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
