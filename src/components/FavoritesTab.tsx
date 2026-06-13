import React, { useState } from "react";
import { 
  Building, 
  Trash2, 
  TrendingUp, 
  Percent, 
  Sparkles, 
  RefreshCw,
  Info,
  FileText
} from "lucide-react";
import { Favorite } from "../types";
import { generateComparisonPDF } from "../utils/pdfGenerator";

interface FavoritesTabProps {
  favorites: Favorite[];
  onRemove: (id: string) => void;
}

export default function FavoritesTab({ favorites, onRemove }: FavoritesTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 3) {
        // limit to 3 properties for easy grid comparative layout
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const comparedProperties = favorites.filter(f => selectedIds.includes(f.id));

  return (
    <div className="space-y-4 pb-2">
      
      {/* Overview intro */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
          ★ Property Comparison Deck ({favorites.length})
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
          Select up to 3 saved properties below to run comparative investment metrics, including ROI, area price efficiency, and 5-year capital appreciation curves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left list: Saved Favorites cards */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">SAVED DECK PROPERTIES</h3>
          
          {favorites.length === 0 ? (
            <div className="text-center py-8 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-800/40 p-3.5">
              <Building className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500 font-medium">Your deck is empty.</p>
              <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed">Valuate properties inside the House Predictor and tap "Favorite in Deck" to save them here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((fav) => {
                const isSelected = selectedIds.includes(fav.id);
                return (
                  <div 
                    key={fav.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? "bg-blue-500/5 border-blue-500 shadow-sm ring-1 ring-blue-500/30" 
                        : "bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-808 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                    onClick={() => handleSelect(fav.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 capitalize">
                          {fav.propertyType} at {fav.location}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {fav.area} sqft • {fav.bedrooms} bds • {fav.bathrooms} ba
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(fav.id);
                          setSelectedIds(prev => prev.filter(x => x !== fav.id));
                        }}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">${fav.price.toLocaleString()}</span>
                      <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">
                        {isSelected ? "✓ SELECTED" : "+ SELECT TO COMP"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right list: Comparative matrix table */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">COMPARATIVE MATRIX ANALYTICS</h3>
          
          {selectedIds.length === 0 ? (
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-200/40 dark:border-slate-800/40 p-8 text-center flex flex-col items-center justify-center min-h-[240px]">
              <RefreshCw className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2 animate-spin" style={{ animationDuration: "12s" }} />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">No Comparatives Chosen</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs leading-normal">
                Select between 1 and 3 properties in your left deck to launch the real-time financial comparative matrix.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/65 dark:border-slate-800/65 p-4 shadow-sm overflow-hidden animate-fade-in">
              <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 pb-2.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                <div>Metric Parameters</div>
                {comparedProperties.map((prop, idx) => (
                  <div key={prop.id} className="text-center font-bold text-blue-600 dark:text-blue-400 truncate px-1 font-mono">
                    H-{idx + 1}
                  </div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300 italic font-medium">Empty Slot</div>
                ))}
              </div>

              {/* Price row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-100 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Total Price</div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center font-bold text-slate-900 dark:text-white font-mono">${prop.price.toLocaleString()}</div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* Price per sqft row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-100 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Price / SqFt</div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center text-slate-500 dark:text-slate-450 font-mono">
                    ${Math.round(prop.price / prop.area)}/sqft
                  </div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* Area row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-100 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Dimensions</div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center text-slate-500 dark:text-slate-450 font-mono">{prop.area.toLocaleString()} SqFt</div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* Bedrooms row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-100 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Beds / Baths</div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center text-slate-500 dark:text-slate-450">{prop.bedrooms}B / {prop.bathrooms}Ba</div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* ROI row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-100 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  Est. ROI <Percent className="h-3.5 w-3.5 text-blue-500" />
                </div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center text-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/35 rounded py-0.5 mx-1 font-bold font-mono">{prop.roi}% / yr</div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* 5-Year appreciation row */}
              <div className="grid grid-cols-4 py-2 border-b border-slate-101 dark:border-slate-850 text-xs items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  5Yr Growth <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                </div>
                {comparedProperties.map(prop => (
                  <div key={prop.id} className="text-center text-slate-500 dark:text-slate-400 font-mono">
                    +{Math.round((prop.appreciation - 1)*100)}%
                  </div>
                ))}
                {Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
                  <div key={idx} className="text-center text-slate-300">-</div>
                ))}
              </div>

              {/* General assessment insights */}
              <div className="mt-4 bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg flex gap-2.5 text-xs leading-normal text-slate-600 dark:text-slate-400 items-start">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-950 dark:text-white flex items-center gap-1 font-display"><Sparkles className="h-3.5 w-3.5 text-blue-500" /> Investment Assessment Recommendation</h4>
                  <p className="mt-0.5 text-[10.5px]">
                    {comparedProperties.length > 1 ? (
                      <span>
                        Based on comparative assessments, 
                        {" "}the property designated as <strong>H-{comparedProperties.indexOf(comparedProperties.reduce((prev, current) => (prev.roi > current.roi) ? prev : current)) + 1}</strong> carries the most optimal price appreciation vector and annual investment ROI metrics, yielding the highest yield coefficient per dollar spent.
                      </span>
                    ) : (
                      "Select multiple properties in the deck to let our intelligence matrix evaluate which listing offers pristine ROI-to-price efficiency coefficients."
                    )}
                  </p>
                </div>
              </div>

              {/* PDF Export trigger */}
              <div className="mt-3.5 flex justify-end">
                <button
                  onClick={() => generateComparisonPDF(comparedProperties)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <FileText className="h-3.5 w-3.5 text-white" /> Download Comparison PDF
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
