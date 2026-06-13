import React, { useState } from "react";
import { 
  Calculator, 
  HelpCircle, 
  Sparkles, 
  Percent, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Sliders
} from "lucide-react";
import { EMIResult } from "../types";

export default function EmiCalculatorTab() {
  const [propertyCost, setPropertyCost] = useState<number>(450000);
  const [downPayment, setDownPayment] = useState<number>(90000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [tenure, setTenure] = useState<number>(30);

  // Core formula computations
  const calculateEMI = (): EMIResult => {
    const principal = Math.max(0, propertyCost - downPayment);
    const monthlyRate = (interestRate / 100) / 12;
    const totalPayments = tenure * 12;

    if (principal <= 0) {
      return { monthlyEMI: 0, totalInterest: 0, totalAmount: 0 };
    }

    if (interestRate <= 0) {
      const emi = principal / totalPayments;
      return {
        monthlyEMI: Math.round(emi),
        totalInterest: 0,
        totalAmount: principal
      };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const roundedEmi = Math.round(emi);
    const totalAmountPayable = roundedEmi * totalPayments;
    const totalInterestPayable = Math.max(0, totalAmountPayable - principal);

    return {
      monthlyEMI: roundedEmi,
      totalInterest: totalInterestPayable,
      totalAmount: totalAmountPayable + downPayment
    };
  };

  const results = calculateEMI();
  const principalAmount = propertyCost - downPayment;
  const totalPaymentsMade = tenure * 12;

  // Percentage sliders helpers
  const downPaymentPercent = Math.round((downPayment / propertyCost) * 100) || 0;

  const updateDownPaymentPercent = (pct: number) => {
    const amt = Math.round((pct / 100) * propertyCost);
    setDownPayment(amt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
      
      {/* Overview Card */}
      <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
          <Calculator className="h-5 w-5 text-blue-500" /> Interactive Mortgage EMI Calculator
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
          Simulate down-payment schedules, interest trends, and loan lengths to evaluate monthly financial feasibility prior to acquisition.
        </p>
      </div>

      {/* Left Column: Sliders and inputs */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <Sliders className="h-3.5 w-3.5 text-blue-500" /> MORTGAGE SLIDERS & INPUTS
        </h3>

        <div className="space-y-3.5">
          {/* Property Cost */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Property Selling Price ($)</label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">${propertyCost.toLocaleString()}</span>
            </div>
            <input 
              id="num_property_cost"
              type="number" 
              min={10000} 
              max={10000000}
              value={propertyCost}
              onChange={e => {
                const val = Number(e.target.value);
                setPropertyCost(val);
                // Adjust downpayment if it exceeds cost
                if (downPayment >= val) {
                  setDownPayment(Math.round(val * 0.2));
                }
              }}
              className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50/50 text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Downpayment Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Down Payment: ${downPayment.toLocaleString()} ({downPaymentPercent}%)</span>
              <button 
                type="button" 
                onClick={() => updateDownPaymentPercent(20)}
                className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold"
              >
                Set 20% standard
              </button>
            </div>
            <input 
              id="range_down_payment"
              type="range"
              min={0}
              max={propertyCost}
              value={downPayment}
              step={1000}
              onChange={e => setDownPayment(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-850 roundedappearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Annual Interest Rate: {interestRate}%</span>
              <span className="text-[10px] text-slate-400">Fixed Rate</span>
            </div>
            <input 
              id="range_interest_rate"
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Loan Tenure Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Loan Tenure: {tenure} Years</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTenure(15)} className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold">15Y</button>
                <button type="button" onClick={() => setTenure(30)} className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold">30Y</button>
              </div>
            </div>
            <input 
              id="range_tenure"
              type="range"
              min={5}
              max={40}
              step={5}
              value={tenure}
              onChange={e => setTenure(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>
      </div>

      {/* Right Column: Calculations Outputs and scheduling highlights */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Output card */}
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-850 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">MONTHLY AMORTIZATION FEE</span>
            <h3 className="text-2xl font-black text-blue-400 mt-1 font-mono">
              ${results.monthlyEMI.toLocaleString()} <span className="text-[11px] font-normal text-slate-300">/ month</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
              Across {totalPaymentsMade} separate monthly amortization payments.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3 text-blue-400" /> Principal Amount</span>
              <span className="font-bold font-mono">${principalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3 text-blue-400" /> Total Interest Accrued</span>
              <span className="font-bold font-mono">${results.totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3 text-blue-400" /> Down Payment</span>
              <span className="font-bold font-mono">${downPayment.toLocaleString()}</span>
            </div>
            
            <hr className="border-slate-800/60 my-1" />

            <div className="flex justify-between text-xs font-semibold text-white items-center">
              <span>Total Committed Capital</span>
              <span className="font-black text-base text-emerald-400 font-mono">${results.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Simple relative visual graph breakdown */}
          <div className="pt-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Mortgage Ratio Breakdown</span>
            <div className="h-3 w-full rounded overflow-hidden flex text-[10px] font-bold text-center">
              <div 
                className="bg-blue-600" 
                style={{ width: `${Math.round(((propertyCost - downPayment) / results.totalAmount) * 100)}%` }}
                title="Principal"
              ></div>
              <div 
                className="bg-amber-500" 
                style={{ width: `${Math.round((results.totalInterest / results.totalAmount) * 100)}%` }}
                title="Interest"
              ></div>
              <div 
                className="bg-emerald-500" 
                style={{ width: `${Math.round((downPayment / results.totalAmount) * 100)}%` }}
                title="Down Payment"
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[8.5px] text-slate-400 font-semibold uppercase">
              <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span> Principal</span>
              <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Interest</span>
              <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Downpay</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
