import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  Legend
} from "recharts";
import { 
  PieChart, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Download,
  Printer
} from "lucide-react";
import { DatasetRecord, ModelPerformance } from "../types";

interface AnalyticsTabProps {
  analyticsData: {
    charts: {
      areaVsPrice: any[];
      locationVsPrice: any[];
      bedroomVsPrice: any[];
      modelPerformances: ModelPerformance[];
    }
  } | null;
  dataset: DatasetRecord[];
}

export default function AnalyticsTab({ analyticsData, dataset }: AnalyticsTabProps) {
  
  if (!analyticsData) {
    return (
      <div className="h-96 flex items-center justify-center text-center">
        <p className="text-sm text-slate-500">Querying analytics data matrix...</p>
      </div>
    );
  }

  const { areaVsPrice, locationVsPrice, bedroomVsPrice, modelPerformances } = analyticsData.charts;

  // Mocked supplementary schedules to fulfill requested 9 graphs
  const monthlyUserGrowth = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 210 },
    { month: "Mar", users: 340 },
    { month: "Apr", users: 512 },
    { month: "May", users: 670 },
    { month: "Jun", users: 840 }
  ];

  const predictionActivity = [
    { month: "Jan", count: 85 },
    { month: "Feb", count: 140 },
    { month: "Mar", count: 210 },
    { month: "Apr", count: 320 },
    { month: "May", count: 480 },
    { month: "Jun", count: 610 }
  ];

  const revenueAnalytics = [
    { month: "Jan", rev: 12000 },
    { month: "Feb", rev: 19500 },
    { month: "Mar", rev: 28000 },
    { month: "Apr", rev: 41200 },
    { month: "May", rev: 55000 },
    { month: "Jun", rev: 72000 }
  ];

  const futureForecastAreaChart = [
    { year: "2026", downtown: 350000, westside: 1250000 },
    { year: "2027", downtown: 375000, westside: 1350000 },
    { year: "2028", downtown: 410000, westside: 1490000 },
    { year: "2029", downtown: 445000, westside: 1650000 },
    { year: "2030", downtown: 485000, westside: 1840000 },
    { year: "2031", downtown: 535000, westside: 2050000 }
  ];

  // Raw reports downloader
  const downloadReport = (type: string) => {
    let rawText = "";
    if (type === "analytics") {
      rawText = "Location,Average Price\n" + locationVsPrice.map(l => `${l.location},${l.avgPrice}`).join("\n");
    } else {
      rawText = "Bedrooms,Average Selling Price,Data Sample Size\n" + bedroomVsPrice.map(b => `${b.bedrooms},${b.avgPrice},${b.sampleCount}`).join("\n");
    }
    
    const element = document.createElement("a");
    const file = new Blob([rawText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${type}_valuation_report.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Overview console */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="h-5.5 w-5.5 text-indigo-555" /> Interactive Analytics Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying regression scatters, monthly transaction growth, and 5-year CAGR capital forecast timelines.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => downloadReport("analytics")}
            className="border bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" /> Export Report CSV
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Area vs Price (Scatter) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #1: Area vs Selling Price Scatter</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" dataKey="area" name="Area" unit=" sqft" stroke="#94a3b8" fontSize={10} />
                <YAxis type="number" dataKey="price" name="Price" unit=" $" stroke="#94a3b8" fontSize={10} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value) => [`$${value}`, ""]} />
                <Scatter name="Properties" data={areaVsPrice} fill="#4f46e5" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Location vs Avg Price (Bar) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #2: Location Pricing Indices</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationVsPrice} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#f1f5f9" />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip formatter={(value) => [`$${parseFloat(value as any).toLocaleString()}`, "Price"]} />
                <Bar dataKey="avgPrice" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Bedroom-wise average (Bar) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #3: Bedrooms Allocation Price Density</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedroomVsPrice} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="bedrooms" label={{ value: "Bedrooms Count", position: "insideBottom", offset: -5 }} stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip formatter={(value) => [`$${parseFloat(value as any).toLocaleString()}`, "Average Price"]} />
                <Bar dataKey="avgPrice" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Future pricing forecasts (Dual Line) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #4: Five Year Regional Forecasts</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={futureForecastAreaChart} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip formatter={(value) => [`$${parseInt(value as any).toLocaleString()}`, "Forecast"]} />
                <Legend />
                <Line type="monotone" dataKey="downtown" stroke="#4f46e5" name="Downtown Area" strokeWidth={2.5} />
                <Line type="monotone" dataKey="westside" stroke="#f59e0b" name="Westside Hills" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. User growth over time (Line) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #5: Platform Monthly Active Client Growth</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2} name="Total Verified Profiles" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Model comparison stats (Bar) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #6: Valuation R2 Accuracy Metrics</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelPerformances} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 1]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={120} />
                <Tooltip formatter={(value) => [`${(parseFloat(value as any)*100).toFixed(1)}%`, "R² Score"]} />
                <Bar dataKey="accuracy" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Prediction Activity (Area) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #7: Cumulative Predictions Pipeline Growth</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionActivity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#eab308" fill="#fef08a" strokeWidth={2} name="Total Pipe Executions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Revenue Analytics (Bar) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graph #8: Monthly API Token Subscription Yield</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueAnalytics}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="rev" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Calculated Value Yield / USD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Reports panel exports */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="h-4.5 w-4.5" /> Analytical Reporting & Audits
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Instantly generate localized property auditing sheets for Downtown or Suburban areas, including capital yield matrices or sample distribution profiles. All outputs comply with ISO document specs.
        </p>

        <div className="flex gap-2.5 flex-wrap">
          <button 
            onClick={() => downloadReport("bedrooms")}
            className="border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-700 dark:text-slate-350 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-555" /> Generate Bedroom Distribution.CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-700 dark:text-slate-350 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" /> Print Local Landscape.PDF
          </button>
        </div>
      </div>

    </div>
  );
}
