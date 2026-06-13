import React, { useState, useRef } from "react";
import { 
  Calculator, 
  MapPin, 
  Sparkles, 
  Upload, 
  FileImage, 
  TrendingUp, 
  Search, 
  Trash2, 
  Share2, 
  ArrowUpDown, 
  Download,
  AlertCircle,
  FileText
} from "lucide-react";
import { Prediction } from "../types";
import { generateSingleValuationPDF } from "../utils/pdfGenerator";

interface PredictorTabProps {
  predictions: Prediction[];
  activeModel: string;
  onPredict: (inputs: any) => Promise<Prediction>;
  onPredictImage: (base64: string, mime: string) => Promise<{ score: number; premiumFactor: number; condition: string; aiEvaluation: string }>;
  onSaveFavorite: (pred: Prediction) => void;
  onDeletePrediction: (id: string) => void;
  favorites: any[];
}

export default function PredictorTab({
  predictions,
  activeModel,
  onPredict,
  onPredictImage,
  onSaveFavorite,
  onDeletePrediction,
  favorites
}: PredictorTabProps) {
  // Input states
  const [area, setArea] = useState<number>(1800);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floors, setFloors] = useState<number>(2);
  const [parking, setParking] = useState<number>(1);
  const [age, setAge] = useState<number>(5);
  const [location, setLocation] = useState<string>("Downtown");
  const [furnishing, setFurnishing] = useState<"unfurnished" | "semi-furnished" | "fully-furnished">("semi-furnished");
  const [propertyType, setPropertyType] = useState<"apartment" | "villa" | "house" | "penthouse">("house");

  const [latitude, setLatitude] = useState<number>(40.7128);
  const [longitude, setLongitude] = useState<number>(-74.0060);

  // Loading & Outputs
  const [predicting, setPredicting] = useState(false);
  const [currentResult, setCurrentResult] = useState<Prediction | null>(null);

  // Image Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageAnalytics, setImageAnalytics] = useState<{ score: number; premiumFactor: number; condition: string; aiEvaluation: string } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Table manipulation filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "area">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Location configurations for coordinates helpers
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    "Downtown": { lat: 40.7128, lng: -74.0060 },
    "City Center": { lat: 40.7589, lng: -73.9851 },
    "Westside Hills": { lat: 34.0522, lng: -118.2437 },
    "Suburb North": { lat: 40.8500, lng: -74.0300 },
    "Lakeside Bay": { lat: 37.7749, lng: -122.4194 }
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    if (locationCoordinates[val]) {
      setLatitude(locationCoordinates[val].lat);
      setLongitude(locationCoordinates[val].lng);
    }
  };

  const handlePredictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);

    let finalPriceMultiplier = 1.0;
    let finalConditionScore = 80;
    if (imageAnalytics) {
      finalPriceMultiplier = imageAnalytics.premiumFactor;
      finalConditionScore = imageAnalytics.score;
    }

    try {
      const predInputs = {
        area,
        bedrooms,
        bathrooms,
        floors,
        parking,
        age,
        location,
        furnishing,
        propertyType,
        latitude,
        longitude
      };

      const result = await onPredict(predInputs);
      // Adjust standard predictedPrice with image analytics modifiers if present
      if (imageAnalytics) {
        result.predictedPrice = Math.round(result.predictedPrice * finalPriceMultiplier);
        result.imageScore = finalConditionScore;
      }

      setCurrentResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  // Image upload handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageError(null);
      setImageAnalytics(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        triggerImageValuation(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageValuation = async (base64Data: string, mimeType: string) => {
    setImageLoading(true);
    setImageError(null);
    try {
      // Remove data URL prefix for raw base64 contents
      const base64Clean = base64Data.split(",")[1] || base64Data;
      const res = await onPredictImage(base64Clean, mimeType);
      setImageAnalytics(res);
    } catch (err: any) {
      setImageError(err.message || "Failed to analyze image condition");
    } finally {
      setImageLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageAnalytics(null);
    setImageError(null);
  };

  // Export predictions as CSV helper
  const exportCSV = () => {
    const headers = ["Area (SqFt)", "Bedrooms", "Bathrooms", "Property Type", "Location", "Furnishing", "Predicted Price", "Date"];
    const rows = predictions.map(p => [
      p.area,
      p.bedrooms,
      p.bathrooms,
      p.propertyType,
      p.location,
      p.furnishing,
      `$${p.predictedPrice}`,
      new Date(p.timestamp).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "property_prediction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format reports for printing as high-tier PDF
  const printReport = () => {
    if (currentResult) {
      generateSingleValuationPDF(currentResult);
    } else {
      window.print();
    }
  };

  // Sorting & Filtering calculations
  let filteredPredictions = predictions.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = item.location.toLowerCase().includes(term) ||
                          item.propertyType.toLowerCase().includes(term);
    const matchesLocation = filterLocation === "all" || item.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  filteredPredictions.sort((a,b) => {
    let comp = 0;
    if (sortBy === "date") {
      comp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortBy === "price") {
      comp = a.predictedPrice - b.predictedPrice;
    } else {
      comp = a.area - b.area;
    }
    return sortDirection === "asc" ? comp : -comp;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
      
      {/* 1. INPUT VALUATION PANEL SECTION */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Calculator className="h-5 w-5 text-blue-500" /> Active Valuation Model ({activeModel})
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
            Provide property parameters. The pipeline utilizes cross-model coefficients for pricing.
          </p>
        </div>

        <form onSubmit={handlePredictSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Area */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Area (Square Feet)</label>
              <input 
                id="input_area"
                type="number" 
                min={200} 
                max={15000} 
                value={area}
                onChange={e => setArea(Number(e.target.value))}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-medium focus:ring-1 focus:ring-blue-500 hover:bg-white transition-all outline-none"
                required
              />
            </div>

            {/* Location Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Property Location</label>
              <select 
                id="input_location"
                value={location}
                onChange={e => handleLocationChange(e.target.value)}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {Object.keys(locationCoordinates).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Slider */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Bedrooms: {bedrooms}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Slider Mode</span>
              </div>
              <input 
                id="range_bedrooms"
                type="range" 
                min={1} 
                max={8} 
                value={bedrooms}
                onChange={e => setBedrooms(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Bathrooms Slider */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Bathrooms: {bathrooms}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Slider Mode</span>
              </div>
              <input 
                id="range_bathrooms"
                type="range" 
                min={1} 
                max={6} 
                step={0.5}
                value={bathrooms}
                onChange={e => setBathrooms(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Floors */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-705 dark:text-slate-300">Structure Floors</label>
              <select 
                id="input_floors"
                value={floors}
                onChange={e => setFloors(Number(e.target.value))}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={1}>1 Floor (Bungalow/Flat)</option>
                <option value={2}>2 Floors (Standard Duplex)</option>
                <option value={3}>3 Floors (Triplex luxury)</option>
              </select>
            </div>

            {/* Parking */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-705 dark:text-slate-300">Parking Slots</label>
              <select 
                id="input_parking"
                value={parking}
                onChange={e => setParking(Number(e.target.value))}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value={0}>0 Spaces</option>
                <option value={1}>1 Covered Space</option>
                <option value={2}>2 Covered Spaces</option>
                <option value={3}>3+ Garage spaces</option>
              </select>
            </div>

            {/* Property Age */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-705 dark:text-slate-300">Property Age (Years)</label>
              <input 
                id="input_age"
                type="number" 
                min={0} 
                max={100} 
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Furnishing Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-705 dark:text-slate-300">Furnishing</label>
              <select 
                id="input_furnishing"
                value={furnishing}
                onChange={e => setFurnishing(e.target.value as any)}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-250 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="fully-furnished">Fully Furnished</option>
                <option value="semi-furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished / Raw</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-755 dark:text-slate-300">Property Type</label>
              <select 
                id="input_property_type"
                value={propertyType}
                onChange={e => setPropertyType(e.target.value as any)}
                className="w-full text-slate-900 dark:text-white px-3 py-1.5 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">Detached House</option>
                <option value="villa">Custom Luxury Villa</option>
                <option value="penthouse">Penthouse Skyloft</option>
              </select>
            </div>

            {/* Geographic Coordinates Panel */}
            <div className="bg-slate-50 dark:bg-slate-955/40 rounded-lg p-2.5 border border-slate-100 dark:border-slate-800 space-y-1 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Geocoding Coordinates</span>
              <div className="flex gap-4 mt-0.5 font-mono">
                <div className="text-slate-900 dark:text-white text-[11px] font-medium">
                  <span className="text-slate-400">Lat:</span> {latitude.toFixed(4)}
                </div>
                <div className="text-slate-900 dark:text-white text-[11px] font-medium">
                  <span className="text-slate-400">Lng:</span> {longitude.toFixed(4)}
                </div>
              </div>
            </div>

          </div>

          <hr className="border-slate-150 dark:border-slate-800 my-2.5" />

          {/* Image analysis inclusion inside standard Predictor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileImage className="h-4 w-4 text-blue-500" /> Add Photo for Architectural Grade Analysis
              </span>
              {imagePreview && (
                <button 
                  type="button" 
                  onClick={clearImage}
                  className="text-[10px] text-red-500 hover:underline hover:text-red-650 cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {!imagePreview ? (
                <label className="flex-1 w-full h-20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-750 hover:border-blue-500/50 bg-slate-50/30 hover:bg-blue-50/5 dark:bg-slate-950/10 transition-all flex flex-col justify-center items-center cursor-pointer p-3 select-none">
                  <Upload className="h-5 w-5 text-slate-400 mb-0.5" />
                  <span className="text-xs text-slate-500 text-center font-bold">Click or Drag Image to Upload</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Gemini Visual analysis estimates property condition premium</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full items-start bg-slate-50/60 dark:bg-slate-950/25 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <img src={imagePreview} alt="property upload" className="w-16 h-16 object-cover rounded border border-slate-200 dark:border-slate-800" />
                  
                  <div className="flex-1 space-y-0.5 text-xs text-slate-650 dark:text-slate-350">
                    {imageLoading ? (
                      <div className="space-y-1 py-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Gemini Vision is analyzing condition...
                        </div>
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded animate-marquee" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    ) : imageAnalytics ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white font-sans">AI Property Index:</span> 
                          <span className="font-bold text-emerald-600 dark:text-emerald-450">{imageAnalytics.score}/100</span>
                        </div>
                        <div className="text-[11px]"><span className="font-semibold text-slate-400">Estimated Condition:</span> <span className="font-bold">{imageAnalytics.condition}</span></div>
                        <div className="text-[11px]"><span className="font-semibold text-slate-400">Market Rate Multiplier:</span> <span className="font-bold text-blue-600 dark:text-blue-400">{imageAnalytics.premiumFactor}x</span></div>
                        <p className="text-[10px] text-slate-500 leading-normal max-w-lg italic mt-1 bg-white/50 dark:bg-slate-900/40 p-1 rounded border border-slate-100 dark:border-slate-850">
                          "{imageAnalytics.aiEvaluation.substring(0, 160)}..."
                        </p>
                      </div>
                    ) : imageError ? (
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <AlertCircle className="h-4 w-4" /> {imageError}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <button 
            id="btn_run_model"
            type="submit" 
            disabled={predicting || imageLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1 text-xs mt-3 h-9"
          >
            {predicting ? (
              <span className="flex items-center gap-2"><span className="animate-spin text-white">●</span> Pricing models computing...</span>
            ) : (
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-white" /> Execute Valuation Pipeline</span>
            )}
          </button>
        </form>
      </div>      {/* 2. LIVE VALUATION RESULT DISPLAY PORTION */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Output card */}
        <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 shadow-sm min-h-[300px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl"></div>
          
          {currentResult ? (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Model Price Output</span>
                <h3 className="text-2xl font-black text-blue-400 mt-1 font-mono">
                  ${currentResult.predictedPrice.toLocaleString()}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10.5px] text-slate-300 font-medium">Confidence:</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono">
                    {(currentResult.confidenceScore * 100).toFixed(0)}%
                  </span>
                  {currentResult.imageScore && (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                      Score: {currentResult.imageScore}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Min</span>
                  <div className="text-xs font-bold text-white mt-0.5 font-mono">
                    ${currentResult.priceRange.min.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Max</span>
                  <div className="text-xs font-bold text-white mt-0.5 font-mono">
                    ${currentResult.priceRange.max.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Projections block */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-350 flex items-center gap-1 font-display">
                  <TrendingUp className="h-4 w-4 text-blue-400" /> Future Appreciation Estimates
                </span>
                
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-800 pb-1">
                    <span>Year 1 Forecast (+5.5% CAGR)</span>
                    <strong className="text-white font-mono">${currentResult.futureValue1Year.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-800 pb-1">
                    <span>Year 3 Forecast (+17% comp.)</span>
                    <strong className="text-white font-mono">${currentResult.futureValue3Years.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Year 5 Forecast (+30% comp.)</span>
                    <strong className="text-white font-mono">${currentResult.futureValue5Years.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Actions footer inside results block */}
              <div className="flex gap-2 mt-3">
                <button 
                  id="btn_add_favorites_deck"
                  onClick={() => onSaveFavorite(currentResult)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer text-white text-[11px] font-bold py-1.5 px-2 rounded-md transition-all active:scale-[0.98]"
                >
                  Favorite in Deck
                </button>
                <button 
                  id="btn_print_valuation_summary"
                  onClick={printReport}
                  className="flex-1 border border-slate-705 bg-transparent hover:bg-slate-800 cursor-pointer text-slate-300 hover:text-white text-[11px] font-bold py-1.5 px-2 rounded-md transition-all hover:border-slate-500"
                >
                  Print Report PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Calculator className="h-10 w-10 text-slate-600 mb-2 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-300">Awaiting Valuation Execution</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs leading-normal">
                Fill in the listing fields on the left and tap "Execute Valuation Pipeline" to view predicted parameters.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* 3. HISTORIC PREDICTIONS & LOG EXPORTS AREA */}
      <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">Active Valuation Logs ({predictions.length})</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Query previous computations, change sorting, or export listings context</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={exportCSV}
              className="flex-1 sm:flex-none border border-slate-205 dark:border-slate-750 hover:bg-slate-50 text-[11px] font-bold px-3 py-1.5 rounded-lg text-slate-750 dark:text-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters and search box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input 
              id="txt_search_logs"
              type="text" 
              placeholder="Search by location / type..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-slate-900 dark:text-white pl-8 pr-3 py-1 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 text-[11px] outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select 
              id="sel_filter_location"
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-205 dark:border-slate-755 bg-slate-50/50 text-[11px] outline-none"
            >
              <option value="all">All Locations</option>
              {Object.keys(locationCoordinates).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <select 
              id="sel_sort_logs"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="flex-1 text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-205 dark:border-slate-750 bg-slate-50/50 text-[11px] outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="area">Sort by Area</option>
            </select>
            <button 
              onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
              className="p-1 px-1.5 border border-slate-205 dark:border-slate-750 rounded-lg bg-slate-50/50 hover:bg-slate-100 cursor-pointer flex items-center justify-center"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* History Table responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-[11px] text-left">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                <th className="py-2 px-3">Parameters</th>
                <th className="py-2 px-3">Location</th>
                <th className="py-2 px-3 text-right">Area</th>
                <th className="py-2 px-3">Furnishing</th>
                <th className="py-2 px-3 text-right">Value (predicted)</th>
                <th className="py-2 px-3 text-right">Forecasted Yr5</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    No matching predictions recorded. Try adjusting your filter parameters or search constraints.
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                      {log.propertyType.replace(/^\w/, c => c.toUpperCase())} ({log.bedrooms}bds, {log.bathrooms}ba)
                    </td>
                    <td className="py-2 px-3">{log.location}</td>
                    <td className="py-2 px-3 text-right font-medium font-mono">{log.area.toLocaleString()} sqft</td>
                    <td className="py-2 px-3 capitalize">{log.furnishing.replace("-", " ")}</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400 font-mono">
                      ${log.predictedPrice.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white font-mono">
                      ${log.futureValue5Years.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => generateSingleValuationPDF(log)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded text-slate-400 hover:text-blue-500 cursor-pointer flex items-center justify-center"
                          title="Download Valuation Report PDF"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => onSaveFavorite(log)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded text-slate-450 hover:text-amber-500 cursor-pointer"
                          title="Add to Favorites"
                        >
                          ★
                        </button>
                        <button 
                          onClick={() => onDeletePrediction(log.id)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
