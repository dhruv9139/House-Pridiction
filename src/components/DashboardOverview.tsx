import React from "react";
import { 
  TrendingUp, 
  UserCheck, 
  Calculator, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Building,
  DollarSign
} from "lucide-react";
import { Prediction } from "../types";

interface DashboardOverviewProps {
  metrics: {
    totalUsers: number;
    totalPredictions: number;
    totalPropertiesCount: number;
    avgPropertyPrice: number;
    modelAccuracy: number;
  };
  predictions: Prediction[];
  favoritesCount: number;
  onNavigate: (tab: string) => void;
  user: { name: string; role: string } | null;
}

export default function DashboardOverview({
  metrics,
  predictions,
  favoritesCount,
  onNavigate,
  user
}: DashboardOverviewProps) {
  const recentPredictions = predictions.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Hero Welcome card wrapper */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-4.5 text-white shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10.5px] font-semibold text-blue-300 border border-blue-500/30 mb-2">
              <Sparkles className="h-3 w-3 text-blue-400" /> Real-time Valuation Engine Active
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight font-display">
              Welcome back, <span className="text-blue-400 font-black">{user?.name}</span>
            </h1>
            <p className="mt-0.5 text-slate-300 text-xs max-w-xl leading-relaxed">
              Conduct instant real estate valuations, explore historic forecasting, calculate mortgage schedules, and let our Gemini-powered AI Assistant guide your investment portfolio.
            </p>
          </div>
          <button 
            id="btn_predict_valuation"
            onClick={() => onNavigate("predictor")}
            className="self-start md:self-auto bg-blue-600 hover:bg-blue-500 transition-all font-semibold py-1.5 px-4 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/15 text-xs whitespace-nowrap cursor-pointer text-white"
          >
            New Property Valuation <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Statistics Row Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:translate-y-[-1px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Run Predictions</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-650 dark:text-blue-450">
              <Calculator className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{metrics?.totalPredictions || 0}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Calculated in AI pipeline</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:translate-y-[-1px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Saved Properties</span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-450">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{favoritesCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">In comparison deck</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:translate-y-[-1px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Property Price</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-600 dark:text-amber-450">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              ${(metrics?.avgPropertyPrice || 450000).toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Global database average</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all hover:translate-y-[-1px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Model Accuracy R²</span>
            <div className="p-1.5 bg-sky-50 dark:bg-sky-950/40 rounded-lg text-sky-655 dark:text-sky-450">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {((metrics?.modelAccuracy || 0.95) * 100).toFixed(1)}%
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">XGBoost Regressor pipeline</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Valuations Panel & Market Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent predictions card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Recent Real Estate Predictions</h3>
              <p className="text-[10.5px] text-slate-400">Latest evaluated properties</p>
            </div>
            <button 
              id="btn_view_history"
              onClick={() => onNavigate("predictor")}
              className="text-xs font-bold text-blue-600 dark:text-blue-450 hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="space-y-2">
            {recentPredictions.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">No predictions recorded yet.</p>
                <button 
                  onClick={() => onNavigate("predictor")}
                  className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-450 hover:underline"
                >
                  Predict first price now
                </button>
              </div>
            ) : (
              recentPredictions.map((pred) => (
                <div 
                  key={pred.id} 
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {pred.area.toLocaleString()} sqft {pred.propertyType.replace(/^\w/, c => c.toUpperCase())}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{pred.location}</span> • <span>{pred.bedrooms} bds</span> • <span>{pred.bathrooms} ba</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-450">
                      ${pred.predictedPrice.toLocaleString()}
                    </div>
                    <span className="text-[9px] text-slate-400 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" /> {new Date(pred.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Market overview panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Market Intel Channels</h3>
          
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-250 dark:border-emerald-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-850 dark:text-emerald-300 tracking-wider uppercase">Westside Hills</span>
                <span className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">Growth: +8.2%</span>
              </div>
              <p className="text-[10.5px] text-emerald-800 dark:text-emerald-300/80 mt-1 leading-normal">
                Superb activity with steady luxury housing demand driving high price averages. Highly Bullish.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 tracking-wider uppercase">Downtown Central</span>
                <span className="text-[9px] font-extrabold text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/80 px-1.5 py-0.2 rounded">Growth: +5.5%</span>
              </div>
              <p className="text-[10.5px] text-blue-820 dark:text-blue-300/80 mt-1 leading-normal">
                Commercial migrations suggest steady commercial-to-residential repurposing. Stable performance.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/40 dark:bg-amber-950/15 border border-amber-150 dark:border-amber-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 tracking-wider uppercase">Suburb North</span>
                <span className="text-[9px] font-extrabold text-amber-700 dark:text-amber-450 bg-amber-100/80 dark:bg-amber-950/80 px-1.5 py-0.2 rounded">Growth: +2.1%</span>
              </div>
              <p className="text-[10.5px] text-amber-800 dark:text-amber-300/80 mt-1 leading-normal">
                Minor housing supply surplus slows immediate appreciation. Bearish momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
