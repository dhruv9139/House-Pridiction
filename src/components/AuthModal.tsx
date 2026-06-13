import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface AuthModalProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);

  // Form parameters
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin 
      ? JSON.stringify({ email, password }) 
      : JSON.stringify({ name, email, password });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication operation failed");
      }

      // If login/registration succeeded
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Unable to reach validation services");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/auth/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      setSuccessMsg(data.message || "Reset instruction token issued successfully");
    } catch (err: any) {
      setError(err.message || "No account matching this email identified");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background aesthetic blurred blobs */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-650/15 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#0ea5e9]/10 blur-3xl"></div>

      <div className="relative w-full max-w-sm bg-slate-900/40 backdrop-blur-xl border border-slate-850 p-7 rounded-2xl shadow-2xl space-y-6">
        
        {/* Logo/Identity */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-600/30">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex justify-center items-center gap-1">
              VALUATION PIPELINE <Sparkles className="h-4 w-4 text-indigo-400" />
            </h1>
            <p className="text-[11px] text-slate-400">Enterprise House Pricing Predictor</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex gap-2 items-center">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-450 text-xs flex gap-2 items-center">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dynamic Forms */}
        {showForgot ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Account Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                <input 
                  id="txt_auth_forgot_email"
                  type="email" 
                  placeholder="admin@housepred.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-white focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button 
              id="btn_submit_forgot"
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? "Issuing details..." : "Request Access Instructions"} <ArrowRight className="h-4 w-4" />
            </button>

            <button 
              type="button" 
              onClick={() => { setShowForgot(false); setError(null); setSuccessMsg(null); }}
              className="text-xs text-slate-400 hover:text-white text-center w-full block pt-2"
            >
              Back to Login session
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input 
                    id="txt_register_name"
                    type="text" 
                    placeholder="Enter full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-white focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                <input 
                  id="txt_auth_email"
                  type="email" 
                  placeholder="admin@housepred.com / user@housepred.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-white focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Account Password</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => { setShowForgot(true); setError(null); setSuccessMsg(null); }}
                    className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                <input 
                  id="txt_auth_password"
                  type="password" 
                  placeholder="Password (type 'password' or custom)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-white focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button 
              id="btn_auth_submit"
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              {loading ? "Authenticating session..." : isLogin ? "Launch Prediction Workspace" : "Create Account Profiles"} <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center">
              <button 
                type="button" 
                onClick={() => { setIsLogin(prev => !prev); setError(null); setSuccessMsg(null); }}
                className="text-xs text-slate-400 hover:text-white"
              >
                {isLogin ? "No profile? Create account" : "Exist profile? Log in"}
              </button>
            </div>
          </form>
        )}

        {/* Demo credentials tips */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-850 space-y-1">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Available Demo Credentials</span>
          <div className="grid grid-cols-2 text-[10px] text-slate-400 leading-snug">
            <div>
              <span className="text-indigo-400 font-bold block">Administrator Mode:</span>
              <span>admin@housepred.com</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold block">User Mode:</span>
              <span>user@housepred.com</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 block text-center pt-1 font-semibold">Universal Credentials Password: <span className="text-slate-300">password</span></span>
        </div>

      </div>

    </div>
  );
}
