import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LandedCostToolProps {
    baseFreight: number;
    currency: string;
}

export const LandedCostTool = ({ baseFreight, currency }: LandedCostToolProps) => {
    const [goodsValue, setGoodsValue] = useState(10000);
    const [dutyRate, setDutyRate] = useState(5.2);
    const [insurance, setInsurance] = useState(150);

    const dutyAmount = (goodsValue * (dutyRate / 100));
    const vatBase = goodsValue + baseFreight + dutyAmount + insurance;
    const vatAmount = vatBase * 0.20; // Assuming 20% VAT standard
    const totalLanded = baseFreight + dutyAmount + insurance + vatAmount;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2">
                    <Calculator className="w-3 h-3 mr-1.5" />
                    Est. Duty & Taxes
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Landed Cost Calculator
                    </DialogTitle>
                    <DialogDescription>
                        Estimate total cost including Duties, Taxes (VAT), and Insurance.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right text-xs text-gray-500">Goods Value</Label>
                        <Input
                            id="value"
                            type="number"
                            value={goodsValue}
                            onChange={(e) => setGoodsValue(Number(e.target.value))}
                            className="col-span-3 h-8"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duty" className="text-right text-xs text-gray-500">Duty Rate %</Label>
                        <Input
                            id="duty"
                            type="number"
                            value={dutyRate}
                            onChange={(e) => setDutyRate(Number(e.target.value))}
                            className="col-span-3 h-8"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ins" className="text-right text-xs text-gray-500">Insurance</Label>
                        <Input
                            id="ins"
                            type="number"
                            value={insurance}
                            onChange={(e) => setInsurance(Number(e.target.value))}
                            className="col-span-3 h-8"
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Freight Cost:</span>
                        <span className="font-mono">{currency} {baseFreight.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Est. Duty ({dutyRate}%):</span>
                        <span className="font-mono">{currency} {dutyAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Insurance:</span>
                        <span className="font-mono">{currency} {insurance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">VAT (20%):</span>
                        <span className="font-mono">{currency} {vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900">
                        <span>Total Landed Cost:</span>
                        <span>{currency} {totalLanded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" className="w-full">Close Estimate</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
