import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  School, 
  Activity, 
  ShoppingBag, 
  Bus, 
  Train, 
  UtensilsCrossed,
  Clock,
  Star
} from "lucide-react";
import { NearbyFacility } from "../types";

export default function FacilitiesFinderTab() {
  const [selectedLocation, setSelectedLocation] = useState<string>("Downtown");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Multi-tier mock facility details matching each regional coordinate zone
  const ALL_FACILITIES: Record<string, NearbyFacility[]> = {
    "Downtown": [
      { name: "Downtown International Academy", type: "school", distance: "0.4 km", duration: "5 mins walk", rating: 4.8, lat: 25, lng: 35 },
      { name: "Metropolitan Academic Prep", type: "school", distance: "1.2 km", duration: "4 mins drive", rating: 4.5, lat: 40, lng: 20 },
      { name: "St. Jude General Hospital", type: "hospital", distance: "0.8 km", duration: "10 mins walk", rating: 4.6, lat: 30, lng: 55 },
      { name: "Downtown Medical Care Center", type: "hospital", distance: "1.9 km", duration: "6 mins drive", rating: 4.2, lat: 50, lng: 80 },
      { name: "Central Plaza Shopping Galleria", type: "shopping mall", distance: "0.2 km", duration: "3 mins walk", rating: 4.9, lat: 15, lng: 25 },
      { name: "Metro Terminal Station A", type: "railway station", distance: "0.5 km", duration: "7 mins walk", rating: 4.4, lat: 60, lng: 40 },
      { name: "Lexington Avenue Bus Depot", type: "bus stop", distance: "0.1 km", duration: "1 min walk", rating: 4.1, lat: 10, lng: 10 },
      { name: "The Truffle House Italian Grill", type: "restaurant", distance: "0.3 km", duration: "4 mins walk", rating: 4.7, lat: 22, lng: 48 }
    ],
    "City Center": [
      { name: "City Plaza High School", type: "school", distance: "0.7 km", duration: "9 mins walk", rating: 4.6, lat: 35, lng: 45 },
      { name: "Central Community Hospital", type: "hospital", distance: "0.3 km", duration: "4 mins walk", rating: 4.8, lat: 15, lng: 60 },
      { name: "Imperial Retail Tower", type: "shopping mall", distance: "0.5 km", duration: "6 mins walk", rating: 4.7, lat: 25, lng: 22 },
      { name: "Central Union Station (Amtrak)", type: "railway station", distance: "0.9 km", duration: "11 mins walk", rating: 4.5, lat: 65, lng: 55 },
      { name: "Grand Bus Junction", type: "bus stop", distance: "0.2 km", duration: "3 mins walk", rating: 4.3, lat: 12, lng: 18 },
      { name: "Bistro de Paris", type: "restaurant", distance: "0.4 km", duration: "5 mins walk", rating: 4.8, lat: 42, lng: 38 }
    ],
    "Westside Hills": [
      { name: "Hills Montessori Academy", type: "school", distance: "1.4 km", duration: "3 mins drive", rating: 4.9, lat: 45, lng: 15 },
      { name: "The Westside Medical Pavilion", type: "hospital", distance: "2.5 km", duration: "5 mins drive", rating: 4.7, lat: 70, lng: 65 },
      { name: "Crestview Heights Plaza", type: "shopping mall", distance: "1.8 km", duration: "4 mins drive", rating: 4.4, lat: 55, lng: 35 },
      { name: "Westside Parkway Commuter Line", type: "railway station", distance: "3.2 km", duration: "8 mins drive", rating: 4.3, lat: 80, lng: 50 },
      { name: "Hills Boulevard Connector Stop", type: "bus stop", distance: "0.6 km", duration: "8 mins walk", rating: 4.2, lat: 30, lng: 28 },
      { name: "Golden Gate Overlook Diner", type: "restaurant", distance: "0.5 km", duration: "6 mins walk", rating: 4.9, lat: 25, lng: 24 }
    ],
    "Suburb North": [
      { name: "Green Valley Public School", type: "school", distance: "0.5 km", duration: "6 mins walk", rating: 4.3, lat: 20, lng: 30 },
      { name: "Norwood Regional Clinic", type: "hospital", distance: "3.1 km", duration: "7 mins drive", rating: 4.1, lat: 85, lng: 75 },
      { name: "Northwood Family Outlets", type: "shopping mall", distance: "2.2 km", duration: "5 mins drive", rating: 4.2, lat: 60, lng: 45 },
      { name: "Suburb North Train Junction", type: "railway station", distance: "1.5 km", duration: "4 mins drive", rating: 4.4, lat: 50, lng: 65 },
      { name: "Maple Lane Bus Stop", type: "bus stop", distance: "0.3 km", duration: "4 mins walk", rating: 4.0, lat: 15, lng: 15 },
      { name: "The Green valley Tavern", type: "restaurant", distance: "0.8 km", duration: "10 mins walk", rating: 4.5, lat: 35, lng: 50 }
    ],
    "Lakeside Bay": [
      { name: "Lakeside STEM Charter School", type: "school", distance: "0.9 km", duration: "11 mins walk", rating: 4.7, lat: 40, lng: 40 },
      { name: "Bay Harbor Urgent Hospital", type: "hospital", distance: "1.2 km", duration: "4 mins drive", rating: 4.6, lat: 50, lng: 60 },
      { name: "The Yacht Harbor Shopping Strip", type: "shopping mall", distance: "0.4 km", duration: "5 mins walk", rating: 4.8, lat: 20, lng: 25 },
      { name: "Bayview Express Transit Stop", type: "bus stop", distance: "0.2 km", duration: "3 mins walk", rating: 4.2, lat: 10, lng: 18 },
      { name: "The Lobster Dock Seafood", type: "restaurant", distance: "0.1 km", duration: "2 mins walk", rating: 4.9, lat: 15, lng: 12 }
    ]
  };

  const facilities = ALL_FACILITIES[selectedLocation] || [];
  const filteredFacilities = facilities.filter(f => selectedType === "all" || f.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case "school": return <School className="h-4 w-4 text-sky-600" />;
      case "hospital": return <Activity className="h-4 w-4 text-emerald-600" />;
      case "shopping mall": return <ShoppingBag className="h-4 w-4 text-amber-600" />;
      case "bus stop": return <Bus className="h-4 w-4 text-blue-600" />;
      case "railway station": return <Train className="h-4 w-4 text-purple-600" />;
      case "restaurant": return <UtensilsCrossed className="h-4 w-4 text-orange-600" />;
      default: return <MapPin className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* Overview Intro */}
      <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <MapPin className="h-5 w-5 text-blue-500" /> Nearby Facilities & Infrastructure Finder
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
            Analyze infrastructure availability within local distance bands. Uses computed distance matrices.
          </p>
        </div>

        {/* Region toggler inside locator header */}
        <div className="flex gap-2">
          <select 
            id="sel_facility_location_sync"
            value={selectedLocation} 
            onChange={e => setSelectedLocation(e.target.value)}
            className="text-xs font-bold text-slate-800 dark:text-white bg-slate-50 border border-slate-205 dark:border-slate-800 px-3 py-1.5 rounded-lg outline-none"
          >
            {Object.keys(ALL_FACILITIES).map(loc => (
              <option key={loc} value={loc}>Location: {loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Left Column: Categorized filters lists */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
          <button 
            id="tab_fac_all"
            onClick={() => setSelectedType("all")} 
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "all" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            All
          </button>
          <button 
            id="tab_fac_schools"
            onClick={() => setSelectedType("school")} 
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "school" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            Schools Check
          </button>
          <button 
            id="tab_fac_hospitals"
            onClick={() => setSelectedType("hospital")} 
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "hospital" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            Hospitals
          </button>
          <button 
            id="tab_fac_shopping"
            onClick={() => setSelectedType("shopping mall")} 
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "shopping mall" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            Malls
          </button>
          <button 
            id="tab_fac_transport"
            onClick={() => setSelectedType("bus stop")}
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "bus stop" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            Transport Stops
          </button>
          <button 
            id="tab_fac_dining"
            onClick={() => setSelectedType("restaurant")} 
            className={`px-3 py-1.5 rounded bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-950/20 text-xs font-bold cursor-pointer transition-all ${selectedType === "restaurant" ? "bg-blue-600! text-white" : "text-slate-650 dark:text-slate-400"}`}
          >
            Restaurants
          </button>
        </div>

        <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
          {filteredFacilities.map((fac, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-150 dark:border-slate-850">
                  {getIcon(fac.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{fac.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="capitalize">{fac.type}</span> • <span className="flex items-center text-amber-550 gap-0.5"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {fac.rating}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{fac.distance}</span>
                <span className="text-[10px] text-slate-400 flex items-center justify-end gap-0.5 mt-0.5">
                  <Clock className="h-3 w-3" /> {fac.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Visual Location Radar Map representation */}
      <div className="lg:col-span-6">
        <div className="bg-[#0b0f19] text-[#60a5fa] rounded-xl p-4 shadow-inner border border-slate-800 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          
          {/* HUD scan overlay */}
          <div className="absolute inset-0 bg-radial-radar opacity-15 pointer-events-none"></div>

          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#60a5fa] uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Infrastructure Radar Scan: {selectedLocation}
            </span>
            <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">GRID: SCAN MODE ACTIVE</span>
          </div>

          {/* Interactive Radar Grid Canvas */}
          <div className="relative w-full h-64 border border-blue-500/10 rounded-xl bg-slate-950/80 overflow-hidden flex items-center justify-center my-3.5">
            
            {/* Center target house pin */}
            <div className="absolute h-8 w-8 rounded-full bg-blue-550/10 border-2 border-[#3b82f6] flex items-center justify-center animate-ping" style={{ animationDuration: "3s" }}></div>
            <div className="absolute h-4 w-4 bg-blue-600 rounded-full border border-white flex items-center justify-center z-10 shadow-lg">
              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            </div>
            
            {/* Sub-Target pins mapping */}
            {filteredFacilities.map((fac, idx) => (
              <div 
                key={idx}
                className="absolute flex flex-col items-center group transition-all duration-300"
                style={{ top: `${fac.lat}%`, left: `${fac.lng}%` }}
              >
                <div className="h-6 w-6 rounded-lg bg-slate-900 border border-blue-500 hover:scale-110 flex items-center justify-center shadow-lg cursor-pointer">
                  {getIcon(fac.type)}
                </div>
                <div className="pointer-events-none opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] py-1 px-1.5 rounded border border-slate-705 absolute bottom-7 whitespace-nowrap z-20 shadow-md">
                  {fac.name} ({fac.distance})
                </div>
              </div>
            ))}

            {/* Simulated circular rings */}
            <div className="absolute h-56 w-56 rounded-full border border-dashed border-blue-500/10"></div>
            <div className="absolute h-40 w-40 rounded-full border border-blue-500/10"></div>
            <div className="absolute h-20 w-20 rounded-full border border-blue-500/5"></div>
            
            {/* Radar scan-line sweep */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent h-full origin-center animate-radar-sweep pointer-events-none z-10"></div>
          </div>

          <div className="z-10 bg-slate-900 border border-slate-800 p-3 rounded-lg flex gap-3 text-[11px] leading-relaxed text-slate-350">
            <MapPin className="h-4 w-4 text-[#3b82f6] shrink-0 mt-0.5" />
            <div>
              <p>
                Currently scanning <strong>{filteredFacilities.length} infrastructure targets</strong> within immediate reach. All walking durations are calculated using average 1.4 m/s stride variables.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
