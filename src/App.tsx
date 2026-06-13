import React, { useState, useEffect } from "react";
import { 
  Building, 
  Home, 
  Calculator, 
  Heart, 
  DollarSign, 
  MapPin, 
  MessageSquare, 
  Database, 
  Users, 
  PieChart, 
  LogOut, 
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

import { Prediction, Favorite, DatasetRecord, ModelPerformance, ChatMessage } from "./types";
import DashboardOverview from "./components/DashboardOverview";
import PredictorTab from "./components/PredictorTab";
import FavoritesTab from "./components/FavoritesTab";
import EmiCalculatorTab from "./components/EmiCalculatorTab";
import FacilitiesFinderTab from "./components/FacilitiesFinderTab";
import AiAssistantTab from "./components/AiAssistantTab";
import AdminDatasetTab from "./components/AdminDatasetTab";
import AdminUsersTab from "./components/AdminUsersTab";
import AnalyticsTab from "./components/AnalyticsTab";
import AuthModal from "./components/AuthModal";

export default function App() {
  // Session Authentication state
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Active Tab navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isThemeDark, setIsThemeDark] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core metrics & lists
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [dataset, setDataset] = useState<DatasetRecord[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeModel, setActiveModel] = useState<string>("XGBoost Regressor");
  const [modelPerformances, setModelPerformances] = useState<ModelPerformance[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // AI Chat states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Profile auth validator callback
  useEffect(() => {
    if (token) {
      validateSession();
    } else {
      setLoadingAuth(false);
    }
  }, [token]);

  const validateSession = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Trigger preloading sequence
        preloadCoreData(data.token || token);
      } else {
        // Clear invalid tokens
        handleLogout();
      }
    } catch {
      handleLogout();
    } finally {
      setLoadingAuth(false);
    }
  };

  const preloadCoreData = async (activeSessionToken: string) => {
    const headers = { "Authorization": `Bearer ${activeSessionToken}` };
    
    try {
      // Predictions list
      const predRes = await fetch("/api/predictions", { headers });
      if (predRes.ok) {
        const data = await predRes.json();
        setPredictions(data.predictions);
      }

      // Saved favorites
      const favRes = await fetch("/api/favorites", { headers });
      if (favRes.ok) {
        const data = await favRes.json();
        setFavorites(data.favorites);
      }

      // Global datasets
      const dataRes = await fetch("/api/dataset", { headers });
      if (dataRes.ok) {
        const data = await dataRes.json();
        setDataset(data.dataset);
      }

      // Settings (active model)
      const settingsRes = await fetch("/api/settings", { headers });
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setActiveModel(data.activeModel);
      }

      // Analytics Summaries & performances
      const analyticsRes = await fetch("/api/analytics/summary", { headers });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalyticsData(data);
        setModelPerformances(data.charts.modelPerformances);
      }

      // Users database if admin
      const uRes = await fetch("/api/users", { headers });
      if (uRes.ok) {
        const data = await uRes.json();
        setUsers(data.users);
      }

    } catch (error) {
      console.error("Data caching failure:", error);
    }
  };

  const handleLoginSuccess = (newToken: string, authedUser: any) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(authedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPredictions([]);
    setFavorites([]);
    setDataset([]);
    setUsers([]);
    setChatHistory([]);
  };

  // Switch dark-light styles directly inside tailwind root classes
  const toggleTheme = () => {
    const isDark = !isThemeDark;
    setIsThemeDark(isDark);
    const htmlElem = document.documentElement;
    if (isDark) {
      htmlElem.classList.add("dark");
    } else {
      htmlElem.classList.remove("dark");
    }
  };

  // API Call proxies
  const handleRunPrediction = async (inputs: any): Promise<Prediction> => {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(inputs)
    });
    
    if (!res.ok) throw new Error("Valuation computational error");
    const data = await res.json();
    
    // Add to state list
    setPredictions(prev => [data.prediction, ...prev]);
    return data.prediction;
  };

  const handlePredictImage = async (base64: string, mime: string) => {
    const res = await fetch("/api/predict-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ imageBase64: base64, mimeType: mime })
    });

    if (!res.ok) throw new Error("Image analyzer error");
    return await res.json();
  };

  const handleSaveFavorite = async (pred: Prediction) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Property in ${pred.location}`,
          area: pred.area,
          bedrooms: pred.bedrooms,
          bathrooms: pred.bathrooms,
          floors: pred.floors,
          parking: pred.parking,
          age: pred.age,
          location: pred.location,
          furnishing: pred.furnishing,
          propertyType: pred.propertyType,
          price: pred.predictedPrice
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Property already favorited");
        return;
      }
      
      const data = await res.json();
      setFavorites(prev => [...prev, data.favorite]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePrediction = async (id: string) => {
    try {
      const res = await fetch(`/api/predictions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPredictions(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // chatbot chat messaging handler
  const handleSendMessage = async (text: string): Promise<string> => {
    setChatLoading(true);
    const newHistory: ChatMessage[] = [...chatHistory, {
      id: Math.random().toString(),
      role: "user",
      text,
      timestamp: new Date().toISOString()
    }];

    setChatHistory(newHistory);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newHistory })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Chatbot was unable to complete task");
      }

      setChatHistory(prev => [...prev, {
        id: Math.random().toString(),
        role: "model",
        text: data.response,
        timestamp: new Date().toISOString()
      }]);

      return data.response;
    } catch (error) {
      console.error(error);
      return "Model connection aborted. Please check internet connections.";
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
  };

  // Dataset controls
  const handleAddRecord = async (record: any) => {
    const res = await fetch("/api/dataset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(record)
    });

    if (!res.ok) throw new Error("Failed to add dataset record");
    const data = await res.json();
    setDataset(prev => [...prev, data.record]);
    return data.record;
  };

  const handleUpdateRecord = async (id: string, updates: any) => {
    const res = await fetch(`/api/dataset/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    if (!res.ok) throw new Error("Failed to edit records");
    const data = await res.json();
    setDataset(prev => prev.map(d => d.id === id ? data.record : d));
    return data.record;
  };

  const handleDeleteRecord = async (id: string) => {
    const res = await fetch(`/api/dataset/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setDataset(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleRetrainPipeline = async () => {
    const res = await fetch("/api/dataset/retrain", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Retraining aborted");
    const data = await res.json();
    setActiveModel(data.activeModel);
    setModelPerformances(data.performances);

    // Refresh statistics cache
    validateSession();
    return data;
  };

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    const res = await fetch(`/api/users/${id}/block`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ isBlocked })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to block user");
    }
    const data = await res.json();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: data.user.isBlocked } : u));
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete user");
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };


  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <Building className="h-12 w-12 text-indigo-500 animate-bounce mb-3" />
        <h4 className="text-slate-300 font-semibold tracking-wide text-xs">Awaiting Valuation Services...</h4>
      </div>
    );
  }

  // Force authentications if token is absent
  if (!token) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="h-4.5 w-4.5" /> },
    { id: "predictor", label: "House Predictor", icon: <Calculator className="h-4.5 w-4.5" /> },
    { id: "favorites", label: "Favorites Deck", icon: <Heart className="h-4.5 w-4.5" /> },
    { id: "emi", label: "Mortgage EMI", icon: <DollarSign className="h-4.5 w-4.5" /> },
    { id: "facilities", label: "Facilities Locator", icon: <MapPin className="h-4.5 w-4.5" /> },
    { id: "chat", label: "AI Advisor Chat", icon: <MessageSquare className="h-4.5 w-4.5" /> },
    { id: "analytics", label: "Analytics Hub", icon: <PieChart className="h-4.5 w-4.5" /> }
  ];

  // Dynamic supplementary tabs for Admins only
  if (user?.role === "admin") {
    navItems.push(
      { id: "dataset", label: "Database Records", icon: <Database className="h-4.5 w-4.5" /> },
      { id: "users", label: "Users Console", icon: <Users className="h-4.5 w-4.5" /> }
    );
  }

  const renderActiveTabProps = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview 
            metrics={analyticsData?.metrics}
            predictions={predictions}
            favoritesCount={favorites.length}
            onNavigate={setActiveTab}
            user={user}
          />
        );
      case "predictor":
        return (
          <PredictorTab 
            predictions={predictions}
            activeModel={activeModel}
            onPredict={handleRunPrediction}
            onPredictImage={handlePredictImage}
            onSaveFavorite={handleSaveFavorite}
            onDeletePrediction={handleDeletePrediction}
            favorites={favorites}
          />
        );
      case "favorites":
        return <FavoritesTab favorites={favorites} onRemove={handleRemoveFavorite} />;
      case "emi":
        return <EmiCalculatorTab />;
      case "facilities":
        return <FacilitiesFinderTab />;
      case "chat":
        return (
          <AiAssistantTab 
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearChatHistory}
            loading={chatLoading}
          />
        );
      case "analytics":
        return <AnalyticsTab analyticsData={analyticsData} dataset={dataset} />;
      case "dataset":
        return (
          <AdminDatasetTab 
            dataset={dataset}
            activeModel={activeModel}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onRetrain={handleRetrainPipeline}
            modelPerformances={modelPerformances}
          />
        );
      case "users":
        return (
          <AdminUsersTab 
            users={users}
            onToggleBlock={handleToggleBlock}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return <div>Tab selection lost. Please refresh.</div>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isThemeDark ? "bg-[#0b0f19] text-slate-100" : "bg-[#f0f2f5] text-slate-900"}`}>
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Building className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 leading-none font-display">
              VALUATION PIPELINE <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            </h1>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Enterprise Valuer Suite</span>
          </div>
        </div>

        {/* Client session metrics controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end select-none">
              {user?.name}
              {user?.role === "admin" && (
                <span className="text-[8px] bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-1 py-0.2 rounded font-extrabold uppercase tracking-wide border border-red-200/50">Admin</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{user?.email}</span>
          </div>

          <button 
            id="btn_toggle_theme"
            onClick={toggleTheme}
            className="p-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-slate-500 dark:text-slate-400 transition-colors"
            title="Toggle theme mode"
          >
            {isThemeDark ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <button 
            id="btn_sign_out"
            onClick={handleLogout}
            className="p-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center justify-center transition-colors"
            title="Log out session"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>

          {/* Mobile responsive toggle */}
          <button 
            id="btn_mobile_menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer md:hidden text-slate-500"
          >
            {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>

      </header>

      {/* Main page content wrapper layout */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        
        {/* Navigation Sidebar */}
        <aside className={`${mobileMenuOpen ? "block" : "hidden"} md:block md:col-span-3 bg-white dark:bg-[#0c0f1d] text-slate-800 dark:text-slate-300 rounded-xl border border-slate-200/60 dark:border-slate-800/80 p-3 space-y-3 shadow-sm sticky top-18`}>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase block px-2 leading-none">SYSTEMS MODULES</span>
          
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav_${item.id}`}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-blue-500 text-white shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span className={`${activeTab === item.id ? "text-white" : "text-slate-400 dark:text-slate-500"}`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <hr className="border-slate-100 dark:border-slate-900 my-1.5" />
          
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-905 rounded-lg space-y-1 text-[10px]">
            <span className="font-bold text-blue-500 uppercase tracking-wide block">Valuation Accuracy</span>
            <p className="text-slate-500 dark:text-slate-400 leading-normal font-semibold">Auto pipeline has assigned XGBoost Regressor as active model.</p>
            <span className="text-[8.5px] font-mono text-slate-400 dark:text-slate-500 block pt-0.5 uppercase">EST. VALUE R²: <strong className="text-emerald-500">95.8%</strong></span>
          </div>
        </aside>

        {/* Dynamic Panel viewport */}
        <main className="col-span-1 md:col-span-9">
          {renderActiveTabProps()}
        </main>

      </div>
    </div>
  );
}
