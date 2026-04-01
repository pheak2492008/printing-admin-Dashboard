import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  Fingerprint,
  Printer,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === "long@gmail.com" && password === "password123") {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
      }, 1500);
    } else {
      setError("Access Denied: Invalid Admin Credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden font-sans bg-white">
      {/* LEFT SECTION: BRANDING (White Background) */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative">
        <div className="relative z-10 text-center animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm mb-8">
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-xl shadow-blue-100">
              <Printer size={48} strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter">
            Printing Service<span className="text-blue-600">Shop</span>
          </h1>
          <p className="text-sm mt-4 font-bold uppercase tracking-[0.3em] text-slate-400">
            Enterprise Inventory Management
          </p>
        </div>
        {/* Subtle decorative grid for the white side */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* RIGHT SECTION: LOGIN FORM (Blue Background) */}
      <div className="w-full lg:w-1/2 bg-[#1e40af] flex flex-col items-center justify-center p-8 lg:p-24 relative">
        {/* Mobile Branding (Only shows on small screens) */}
        <div className="lg:hidden text-center mb-12">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            PrintPulse<span className="text-blue-300">PRO</span>
          </h1>
        </div>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Printing Admin
            </h2>
            <p className="text-blue-200/60 text-sm font-medium">
              Please enter your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <Fingerprint
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50 group-focus-within:text-white transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="admin@printpulse.pro"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-blue-300/30 outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                  Access Key
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-blue-300 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Reset Key?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50 group-focus-within:text-white transition-colors"
                  size={20}
                />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-blue-300/30 outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR FEEDBACK */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-[11px] font-bold p-4 rounded-xl animate-shake">
                {error}
              </div>
            )}

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#1e40af] font-black py-4 rounded-xl transition-all shadow-lg hover:bg-blue-50 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER INFO */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">
                System Node: US-E1
              </span>
            </div>
            <span className="text-[9px] font-bold text-white tracking-widest uppercase">
              Version 2.4.1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
