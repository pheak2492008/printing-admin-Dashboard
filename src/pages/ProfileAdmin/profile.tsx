<<<<<<< HEAD
import { useState } from "react";
import {
  Mail,
  Shield,
  Globe,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Star,
  Camera,
  Edit2,
  Award,
  Clock,
  CheckCircle2,
  Smartphone,
  Key,
  Download,
  Trash2,
  AlertTriangle,
  Activity,
  Package,
=======
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
>>>>>>> staging
  TrendingUp,
  Users,
} from "lucide-react";

<<<<<<< HEAD
// ── Data ─────────────────────────────────────────────────────

const ACCOUNT_SETTINGS = [
  {
    section: "Contact",
    items: [
      {
        icon: Mail,
        label: "Email Address",
        value: "alex.rivera@printpulse.com",
        color: "bg-blue-50 text-blue-500",
      },
      {
        icon: Smartphone,
        label: "Phone Number",
        value: "+1 (555) 024-8810",
        color: "bg-sky-50 text-sky-500",
      },
    ],
  },
  {
    section: "Security",
    items: [
      {
        icon: Shield,
        label: "Password",
        value: "Last changed 32 days ago",
        color: "bg-violet-50 text-violet-500",
      },
      {
        icon: Key,
        label: "Two-Factor Auth",
        value: "Enabled via Authenticator App",
        color: "bg-emerald-50 text-emerald-500",
        badge: { label: "Active", style: "bg-emerald-50 text-emerald-600" },
      },
    ],
  },
  {
    section: "Localization",
    items: [
      {
        icon: Globe,
        label: "Language",
        value: "English (US)",
        color: "bg-amber-50 text-amber-500",
      },
    ],
  },
];

const PREFERENCES: Array<{
  icon: typeof Bell;
  label: string;
  sub: string;
  key: "push" | "dark" | "auto";
  color: string;
}> = [
  {
    icon: Bell,
    label: "Push Notifications",
    sub: "Alerts for new orders & errors",
    key: "push",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Moon,
    label: "Dark Mode",
    sub: "Toggle app appearance",
    key: "dark",
    color: "bg-slate-100 text-slate-500",
  },
  {
    icon: Download,
    label: "Auto-download Reports",
    sub: "Save weekly reports automatically",
    key: "auto",
    color: "bg-violet-50 text-violet-500",
  },
];

const RECENT_ACTIVITY = [
  {
    action: "Processed order #ORD-2841",
    time: "2 hours ago",
    icon: Package,
    color: "text-blue-500 bg-blue-50",
  },
  {
    action: "Updated stock: PVC Vinyl",
    time: "5 hours ago",
    icon: Activity,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    action: "Exported March sales report",
    time: "Yesterday",
    icon: Download,
    color: "text-violet-500 bg-violet-50",
  },
  {
    action: "Added new supplier: QuickInk",
    time: "2 days ago",
    icon: Users,
    color: "text-amber-500 bg-amber-50",
  },
  {
    action: "Flagged low stock alert",
    time: "3 days ago",
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-50",
  },
];

const STAFF_STATS = [
  {
    label: "Orders Processed",
    value: "1,842",
    icon: Package,
    color: "text-blue-500",
  },
  { label: "Avg. Rating", value: "4.9 ★", icon: Star, color: "text-amber-400" },
  {
    label: "On-time Rate",
    value: "98.2%",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    label: "Active Since",
    value: "Jan 2022",
    icon: Clock,
    color: "text-violet-500",
  },
];

// ── Toggle Switch ─────────────────────────────────────────────
function Toggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${active ? "bg-blue-500" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

// ── Section Block ─────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function ProfilePage() {
  const [prefs, setPrefs] = useState({ push: true, dark: false, auto: false });
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Alex Rivera");
  const [role, setRole] = useState("Senior Print Technician");

  const togglePref = (key: "push" | "dark" | "auto") =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div
      className="min-h-screen bg-slate-50 pb-24"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-extrabold text-slate-800 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Profile
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your account & preferences
            </p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
              editMode
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Edit2 size={13} /> {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-5">
        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-24 relative overflow-hidden bg-gradient-to-r from-blue-600 via-sky-500 to-violet-600">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>

          {/* Avatar + Info */}
          <div className="px-6 pb-5 relative">
            <div className="flex items-end gap-4 -mt-10 mb-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="text-2xl font-extrabold text-white">AR</span>
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full" />
                {editMode && (
                  <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={18} className="text-white" />
                  </button>
                )}
              </div>

              {/* Name & Role */}
              <div className="pb-1 flex-1 min-w-0">
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-lg font-bold text-slate-800 border-b-2 border-blue-400 outline-none bg-transparent"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    />
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-sm text-slate-500 border-b border-slate-200 outline-none bg-transparent"
                    />
                  </div>
                ) : (
                  <>
                    <h2
                      className="text-xl font-extrabold text-slate-800 tracking-tight truncate"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {name}
                    </h2>
                    <p className="text-sm text-slate-400">{role}</p>
                  </>
                )}
              </div>

              {/* Staff ID badge */}
              <div className="pb-1 flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-100">
                  <Award size={11} className="fill-blue-300 text-blue-400" />
                  STAFF ID: PG-0552
                </span>
              </div>
            </div>

            {/* Staff Stats */}
            <div className="grid grid-cols-4 gap-3">
              {STAFF_STATS.map((s, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl px-3 py-3 text-center border border-slate-100"
                >
                  <s.icon size={14} className={`${s.color} mx-auto mb-1.5`} />
                  <div
                    className="text-sm font-bold text-slate-800 leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Account Settings ── */}
        {ACCOUNT_SETTINGS.map((group, gi) => (
          <Section key={gi} title={group.section}>
            <div className="divide-y divide-slate-50">
              {group.items.map((item, ii) => (
                <button
                  key={ii}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {item.value}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-lg mr-1 ${item.badge.style}`}
                    >
                      {item.badge.label}
                    </span>
                  )}
                  <ChevronRight
                    size={15}
                    className="text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          </Section>
        ))}

        {/* ── Preferences ── */}
        <Section title="Preferences">
          <div className="divide-y divide-slate-50">
            {PREFERENCES.map((pref, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div
                  className={`w-9 h-9 rounded-xl ${pref.color} flex items-center justify-center flex-shrink-0`}
                >
                  <pref.icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700">
                    {pref.label}
                  </div>
                  <div className="text-xs text-slate-400">{pref.sub}</div>
                </div>
                <Toggle
                  active={prefs[pref.key]}
                  onToggle={() => togglePref(pref.key)}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Recent Activity ── */}
        <Section title="Recent Activity">
          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}
                >
                  <a.icon size={14} />
                </div>
                <div className="flex-1 text-sm text-slate-700">{a.action}</div>
                <div
                  className="text-xs text-slate-400 flex-shrink-0"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {a.time}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <Section title="Danger Zone">
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
              <div className="flex items-center gap-3">
                <Trash2 size={15} className="text-rose-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    Delete Account
                  </div>
                  <div className="text-xs text-slate-400">
                    This action cannot be undone
                  </div>
                </div>
              </div>
              <button className="text-xs font-semibold text-rose-500 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-all">
                Delete
              </button>
            </div>
          </div>
        </Section>

        {/* ── Log Out ── */}
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-500 font-semibold text-sm rounded-2xl py-4 hover:bg-rose-50 transition-all shadow-sm">
          <LogOut size={16} /> Log Out
        </button>

        {/* Footer */}
        <p
          className="text-center text-xs text-slate-300 pb-2"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          PrintPulse PRO v2.4.1 · Build 203
        </p>
=======
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

const API_BASE = "http://localhost:8081/api/v1/admin/profile";

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
        fetch("http://localhost:8081/api/orders/getall", { headers }),
        fetch("http://localhost:8081/api/v1/users/all", { headers }),
        fetch("http://localhost:8081/api/v1/reviews/summary", { headers }),
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
    (profile.avatarUrl ? `http://localhost:8081${profile.avatarUrl}` : null);

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
>>>>>>> staging
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

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
>>>>>>> staging
