import React, { useState } from "react";
import { 
  Building, 
  Trash2, 
  Plus, 
  Edit, 
  Play, 
  Search, 
  Upload, 
  Database, 
  Cpu, 
  TrendingUp, 
  Save, 
  X,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { DatasetRecord, ModelPerformance } from "../types";

interface AdminDatasetTabProps {
  dataset: DatasetRecord[];
  activeModel: string;
  onAddRecord: (record: any) => Promise<any>;
  onUpdateRecord: (id: string, updates: any) => Promise<any>;
  onDeleteRecord: (id: string) => Promise<void>;
  onRetrain: () => Promise<{ activeModel: string; performances: ModelPerformance[] }>;
  modelPerformances: ModelPerformance[];
}

export default function AdminDatasetTab({
  dataset,
  activeModel,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onRetrain,
  modelPerformances
}: AdminDatasetTabProps) {
  // New row input states
  const [showAddForm, setShowAddForm] = useState(false);
  const [area, setArea] = useState<number>(1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floors, setFloors] = useState<number>(1);
  const [parking, setParking] = useState<number>(1);
  const [age, setAge] = useState<number>(5);
  const [location, setLocation] = useState<string>("Downtown");
  const [furnishing, setFurnishing] = useState<"unfurnished" | "semi-furnished" | "fully-furnished">("semi-furnished");
  const [propertyType, setPropertyType] = useState<"apartment" | "villa" | "house" | "penthouse">("house");
  const [price, setPrice] = useState<number>(400000);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editArea, setEditArea] = useState<number>(0);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterLoc, setFilterLoc] = useState("all");

  // Retraining logs
  const [retraining, setRetraining] = useState(false);
  const [retrainLogs, setRetrainLogs] = useState<string | null>(null);

  // CSV parsing simulator
  const [csvRaw, setCsvRaw] = useState("");
  const [showCsvTool, setShowCsvTool] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddRecord({
        area,
        bedrooms,
        bathrooms,
        floors,
        parking,
        age,
        location,
        furnishing,
        propertyType,
        price
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      await onUpdateRecord(id, { price: editPrice, area: editArea });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerRetrainingSequence = async () => {
    setRetraining(true);
    setRetrainLogs("Extracting dataset row dimensions...\nFitting linear gradients...\nConstructing regression trees...\nBootstrapping Random Forest estimators...\nOptimizing XGBoost learning hyperplanes...");
    
    setTimeout(async () => {
      try {
        const res = await onRetrain();
        setRetrainLogs(`Retraining complete! Matched optimal model parameters over ${dataset.length} records.\nSelected model: ${res.activeModel}.\nOptimal validation accuracy yielded.`);
      } catch (err) {
        setRetrainLogs("ML training pipeline failure: error reading files.");
      } finally {
        setRetraining(false);
      }
    }, 2500);
  };

  // CSV text importer parser
  const handleCsvImport = async () => {
    setCsvError(null);
    if (!csvRaw.trim()) {
      setCsvError("Paste proper CSV rows first.");
      return;
    }

    try {
      const lines = csvRaw.trim().split("\n");
      const headers = lines[0].split(",");
      
      const parsedRecords: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length < headers.length) continue;

        // Build mapping
        const rec: any = {};
        headers.forEach((h, idx) => {
          const key = h.trim().toLowerCase();
          const val = values[idx] ? values[idx].trim() : "";
          
          if (["area", "price", "bedrooms", "bathrooms", "floors", "parking", "age"].includes(key)) {
            rec[key] = parseFloat(val) || 0;
          } else {
            rec[key] = val;
          }
        });

        parsedRecords.push(rec);
      }

      if (parsedRecords.length === 0) {
        throw new Error("No readable records parsed from rows.");
      }

      // Execute import calling API
      const response = await fetch("/api/dataset/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ records: parsedRecords })
      });
      
      if (!response.ok) {
        throw new Error("Bulk upload aborted by server configuration.");
      }

      // Reload dataset parent updates
      window.location.reload();
    } catch (err: any) {
      setCsvError(err.message || "Failed parsing CSV parameters. Double check formatting.");
    }
  };

  const filteredDataset = dataset.filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(search.toLowerCase()) || 
                          item.propertyType.toLowerCase().includes(search.toLowerCase());
    const matchesLoc = filterLoc === "all" || item.location === filterLoc;
    return matchesSearch && matchesLoc;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* Overview console */}
      <div className="lg:col-span-12 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="h-5.5 w-5.5 text-indigo-550" /> Admin Datasets & ML Training Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain high-quality listings metadata, import global CSV files, and trigger custom comparative model retraining.
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            id="btn_add_record_toggle"
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-600/10 cursor-pointer text-white font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {showAddForm ? "Cancel Form" : "Add Row"}
          </button>
          <button 
            id="btn_csv_tool_toggle"
            onClick={() => setShowCsvTool(prev => !prev)}
            className="flex-1 sm:flex-none border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-350 cursor-pointer font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="h-4 w-4" /> Bulk Upload CSV
          </button>
        </div>
      </div>

      {/* CSV importer overlay */}
      {showCsvTool && (
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-150">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-indigo-500" /> Enter CSV Records Bulk Data
              </h3>
              <p className="text-[10.5px] text-slate-400 mt-0.5">Separate with commas. First row MUST define header variables.</p>
            </div>
            <button onClick={() => setShowCsvTool(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer">×</button>
          </div>

          <div className="space-y-4">
            <textarea 
              id="txt_csv_box"
              rows={4}
              placeholder={`area,bedrooms,bathrooms,floors,parking,age,location,furnishing,propertyType,price
1400,2,2,1,1,5,Downtown,semi-furnished,apartment,390000
1850,3,2,1,1,10,Suburb North,fully-furnished,house,420000`}
              value={csvRaw}
              onChange={e => setCsvRaw(e.target.value)}
              className="w-full text-slate-900 dark:text-white font-mono p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 text-xs"
            ></textarea>
            
            {csvError && (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {csvError}
              </div>
            )}

            <button 
              id="btn_run_csv_import"
              onClick={handleCsvImport}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              Parse & Import Row Records
            </button>
          </div>
        </div>
      )}

      {/* Add Form portion if toggled */}
      {showAddForm && (
        <form onSubmit={handleCreateSubmit} className="lg:col-span-12 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-4 font-bold text-sm text-slate-800 dark:text-white border-b pb-2 mb-2">Create Listing Record</div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Area (SqFt)</label>
            <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Selling Price ($)</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Property Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs">
              <option value="Downtown">Downtown</option>
              <option value="City Center">City Center</option>
              <option value="Westside Hills">Westside Hills</option>
              <option value="Suburb North">Suburb North</option>
              <option value="Lakeside Bay">Lakeside Bay</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Property Type</label>
            <select value={propertyType} onChange={e => setPropertyType(e.target.value as any)} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs">
              <option value="apartment">Apartment</option>
              <option value="house">Detached House</option>
              <option value="villa">Custom Luxury Villa</option>
              <option value="penthouse">Penthouse Skyloft</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Bedrooms</label>
            <input type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Bathrooms</label>
            <input type="number" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Parking</label>
            <input type="number" value={parking} onChange={e => setParking(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Age</label>
            <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 p-2 border rounded-xl text-xs" required />
          </div>

          <div className="sm:col-span-4 flex justify-end gap-2 mt-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-2 px-5 rounded-xl text-xs cursor-pointer">Commit New Record</button>
          </div>
        </form>
      )}

      {/* Dataset Records CRUD list Table */}
      <div className="lg:col-span-8 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Datasets logs ({dataset.length})</h3>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input 
                id="txt_search_dataset"
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-36 text-slate-950 dark:text-white pl-8 pr-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]"
              />
            </div>
            <select 
              id="sel_dataset_loc"
              value={filterLoc} 
              onChange={e => setFilterLoc(e.target.value)}
              className="text-[11px] font-medium border rounded-lg px-2 bg-slate-50 dark:bg-slate-950/20"
            >
              <option value="all">All Locations</option>
              <option value="Downtown">Downtown</option>
              <option value="City Center">City Center</option>
              <option value="Westside Hills">Westside Hills</option>
              <option value="Suburb North">Suburb North</option>
              <option value="Lakeside Bay">Lakeside Bay</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs text-left">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-right">Area</th>
                <th className="py-2.5 px-3 text-right">Price Value ($)</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredDataset.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">No database rows match choice tags.</td>
                </tr>
              ) : (
                filteredDataset.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-2.5 px-3 font-medium capitalize">
                        {item.propertyType} • {item.bedrooms}bds, {item.bathrooms}ba
                      </td>
                      <td className="py-2.5 px-3">{item.location}</td>
                      <td className="py-2.5 px-3 text-right">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editArea} 
                            onChange={e => setEditArea(Number(e.target.value))} 
                            className="bg-white border rounded p-1 w-16 text-right"
                          />
                        ) : (
                          <span>{item.area.toLocaleString()} sqft</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editPrice} 
                            onChange={e => setEditPrice(Number(e.target.value))} 
                            className="bg-white border rounded p-1 w-24 text-right"
                          />
                        ) : (
                          <span>${item.price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex gap-2.5 justify-center">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleEditSave(item.id)} className="text-green-600 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"><Save className="h-3 w-3" /> Save</button>
                              <button onClick={() => setEditingId(null)} className="text-slate-405 hover:underline flex items-center gap-0.5 cursor-pointer"><X className="h-3 w-3" /> Cancel</button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditPrice(item.price);
                                  setEditArea(item.area);
                                }}
                                className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                                title="Edit row"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => onDeleteRecord(item.id)}
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                                title="Delete row"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Learning Pipeline & Comparative performances logs */}
      <div className="lg:col-span-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Cpu className="h-4.5 w-4.5 text-indigo-505 animate-spin" style={{ animationDuration: "14s" }} /> Auto Model Retraining Pipeline
        </h3>

        <button 
          id="btn_retrain_pipeline"
          onClick={triggerRetrainingSequence} 
          disabled={retraining}
          className="w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-slate-800 cursor-pointer disabled:opacity-40 select-none flex items-center justify-center gap-2"
        >
          {retraining ? "Executing auto training..." : "Force Pipeline Retraining"} <Play className="h-3.5 w-3.5 fill-white" />
        </button>

        {retrainLogs && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold block mb-1">Process Standard Output Logs</span>
            <pre className="text-[10px] font-mono text-emerald-450 leading-relaxed font-semibold whitespace-pre-wrap select-none max-h-24 overflow-y-auto">
              {retrainLogs}
            </pre>
          </div>
        )}

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coefficients Performance Comparations</span>
          
          <div className="space-y-2">
            {modelPerformances.map((perf, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl border transition-colors ${
                  perf.name === activeModel 
                    ? "bg-indigo-50/15 border-indigo-500/50 shadow-sm" 
                    : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-850 dark:text-white flex items-center gap-1">
                    {perf.name}
                    {perf.name === activeModel && (
                      <span className="text-[8px] text-white bg-indigo-650 font-extrabold px-1 py-0.2 rounded uppercase">Active</span>
                    )}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-450">{(perf.accuracy * 100).toFixed(1)}% R²</span>
                </div>
                
                {/* Visual bar graph representation */}
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${perf.name === activeModel ? "bg-indigo-500" : "bg-slate-400"}`}
                    style={{ width: `${perf.accuracy * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase font-extrabold mt-1">
                  <span>MAE: ${Math.round(perf.mae).toLocaleString()}</span>
                  <span>RMSE: ${Math.round(perf.rmse).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
