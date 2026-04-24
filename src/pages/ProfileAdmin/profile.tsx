import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Save,
  Edit2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  CheckCircle2,
  Package,
  LogOut,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";

// --- INTERFACES ---
interface ProfileData {
  userId: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl: string;
  email: string;
}

interface DashboardStats {
  orders: string;
  staff: string;
  growth: string;
  status: string;
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (v: string) => void;
}

const API_BASE = "https://printing-back-end.onrender.com/api/v1/admin/profile";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    userId: localStorage.getItem("userId") || "1",
    name: "",
    phone: "",
    address: "",
    avatarUrl: "",
    email: localStorage.getItem("userEmail") || "",
  });

  const [stats, setStats] = useState<DashboardStats>({
    orders: "0",
    staff: "0",
    growth: "0%",
    status: "Loading...",
  });

  // --- 1. FETCH ALL DASHBOARD DATA ---
  const fetchDashboardData = async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    const userId = localStorage.getItem("userId") || "1";

    if (!token) {
      navigate("/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      // Parallel fetching from multiple endpoints
      const [profileRes, ordersRes, staffRes, reportsRes] = await Promise.all([
        fetch(`${API_BASE}/${userId}`, { headers }),
        fetch("https://printing-back-end.onrender.com/api/orders/getall", {
          headers,
        }),
        fetch("https://printing-back-end.onrender.com/api/v1/users/all", {
          headers,
        }),
        fetch("https://printing-back-end.onrender.com/api/v1/reviews/summary", {
          headers,
        }),
      ]);

      // Update Profile
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile((prev) => ({
          ...prev,
          name: data.fullName || "Admin User",
          phone: data.phone || "Not Set",
          address: data.address || "No Office Assigned",
          avatarUrl: data.avatarUrl || "",
        }));
      }

      // Update Dashboard Stats
      const orderData = ordersRes.ok ? await ordersRes.json() : [];
      const staffData = staffRes.ok ? await staffRes.json() : [];
      const reviewData = reportsRes.ok ? await reportsRes.json() : null;

      setStats({
        orders: Array.isArray(orderData) ? orderData.length.toString() : "1.2k",
        staff: Array.isArray(staffData)
          ? staffData.filter((u: any) => u.role === "STAFF").length.toString()
          : "12",
        growth: reviewData?.positivePercentage
          ? `+${reviewData.positivePercentage}%`
          : "+14%",
        status: "Active",
      });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
      setMounted(true);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- 2. UPDATE PROFILE ---
  const handleSave = async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) return navigate("/login");

    setIsSaving(true);
    const formData = new FormData();

    const profileRequest = {
      fullName: profile.name,
      phone: profile.phone,
      address: profile.address,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(profileRequest)], { type: "application/json" }),
    );

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE}/${profile.userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setEditMode(false);
        setPreviewUrl(null);
        await fetchDashboardData();
        alert("Profile synchronised successfully.");
      }
    } catch (err) {
      alert("Network Error: Could not save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  const avatarSrc =
    previewUrl ||
    (profile.avatarUrl
      ? `https://printing-back-end.onrender.com${profile.avatarUrl}`
      : null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-800">
      <div
        className={`max-w-6xl mx-auto transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0 translate-y-4"}`}
      >
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Admin <span className="text-blue-600">Profile</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">
              System Node: {profile.userId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {editMode ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-2xl shadow-lg transition-all active:scale-95"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}{" "}
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold uppercase rounded-2xl border border-slate-200 shadow-sm transition-all"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PROFILE CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] text-center shadow-sm relative overflow-hidden">
              <div className="relative w-44 h-44 mx-auto mb-6 group">
                <div className="w-full h-full rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-5xl font-black text-blue-600 overflow-hidden shadow-inner">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name.charAt(0) || "A"
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl border-4 border-white text-white shadow-xl hover:scale-110 transition-transform"
                  >
                    <Camera size={20} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>

              {editMode ? (
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-600 outline-none pb-1 bg-transparent"
                />
              ) : (
                <h2 className="text-2xl font-black text-slate-900">
                  {profile.name}
                </h2>
              )}
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                Enterprise Administrator
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <h3 className="text-slate-900 text-xs font-black uppercase mb-4 flex items-center gap-2">
                <Shield size={16} className="text-blue-600" /> Security Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={16} className="text-emerald-500" /> System
                  Authentication Verified
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS & DYNAMIC STATS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <InfoItem
                icon={Mail}
                label="Contact Email"
                value={profile.email}
              />
              <InfoItem
                icon={Phone}
                label="Mobile"
                value={profile.phone}
                editable={editMode}
                onChange={(v) => setProfile({ ...profile, phone: v })}
              />
              <InfoItem icon={Clock} label="Timezone" value="GMT +7" />
              <InfoItem
                icon={MapPin}
                label="Base Location"
                value={profile.address}
                editable={editMode}
                onChange={(v) => setProfile({ ...profile, address: v })}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon={Package} label="Orders" val={stats.orders} />
              <StatBox icon={TrendingUp} label="Growth" val={stats.growth} />
              <StatBox icon={Zap} label="Status" val={stats.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---
function InfoItem({
  icon: Icon,
  label,
  value,
  editable,
  onChange,
}: InfoItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
        <Icon size={14} className="text-blue-500" /> {label}
      </div>
      {editable && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors"
        />
      ) : (
        <p className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-4">
          {value || "Unset"}
        </p>
      )}
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  val,
}: {
  icon: React.ElementType;
  label: string;
  val: string;
}) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] text-center shadow-sm hover:border-blue-300 transition-all group">
      <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={18} className="text-blue-600 group-hover:text-white" />
      </div>
      <p className="text-xl font-black text-slate-900">{val}</p>
      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}
