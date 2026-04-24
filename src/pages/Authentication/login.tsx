import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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

  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // DEBUG: See exactly what your backend is sending
        console.log("Backend Response:", data);

        // 1. Determine which key your backend uses for ID (id or userId)
        const idToStore = data.userId || data.id;

        if (!idToStore) {
          setError("Login successful, but Backend failed to send a User ID.");
          return;
        }

        // 2. Store the data safely
        localStorage.setItem("token", data.token || data.accessToken);
        localStorage.setItem("accessToken", data.accessToken || data.token);
        localStorage.setItem("userId", idToStore.toString());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // 3. Redirect
        window.location.href = "/"; // Go straight to profile to test it
      } else {
        setError(data.message || "Access Denied: Invalid Credentials.");
      }
    } catch (err) {
      setError("Server Error: Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden font-sans bg-white">
      {/* LEFT PANEL: BRANDING (No changes here) */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative border-r border-slate-100">
        <div className="relative z-10 text-center animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex p-6 rounded-[2.5rem] bg-slate-50 border border-slate-200/60 shadow-sm mb-8">
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-xl shadow-blue-100">
              <Printer size={56} strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter">
            Printing Service<span className="text-blue-600">Shop</span>
          </h1>
          <p className="text-sm mt-4 font-bold uppercase tracking-[0.3em] text-slate-400">
            Enterprise Inventory Management
          </p>
        </div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* RIGHT PANEL: SYSTEM AUTHORIZATION */}
      <div className="w-full lg:w-1/2 bg-[#1e40af] flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              System Authorization
            </h2>
            <p className="text-blue-200/50 text-sm font-medium">
              Internal access only. Please sign in to continue.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <Fingerprint
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/40 group-focus-within:text-white transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="admin@printshop.com"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-blue-300/20 outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">
                  Access Key
                </label>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/40 group-focus-within:text-white transition-colors"
                  size={20}
                />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-blue-300/20 outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-[11px] font-bold p-4 rounded-xl animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#1e40af] font-black py-4 rounded-xl transition-all shadow-xl hover:bg-blue-50 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authorize & Enter <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER STATUS (No changes here) */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">
                Status: Ready
              </span>
            </div>
            <span className="text-[9px] font-bold text-white tracking-widest uppercase">
              Node: US-E1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
