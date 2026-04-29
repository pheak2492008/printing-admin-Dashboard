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

// ✅ Point to your verified Port 8082
const API_BASE = "http://localhost:8082/api/v1";

interface ProfileData {
  userId: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl: string;
  email: string;
}

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
    email: localStorage.getItem("userEmail") || "admin@shop.com",
  });

  const [stats, setStats] = useState({
    orders: "0",
    growth: "0%",
    status: "Active",
  });

  // ✅ Consolidated Data Fetching with Auth
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [profileRes, ordersRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/profile/${profile.userId}`, { headers }),
        fetch(`${API_BASE}/orders/getall`, { headers }),
        fetch(`${API_BASE}/reviews/summary`, { headers }),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile((prev) => ({
          ...prev,
          name: data.fullName || "Admin User",
          phone: data.phone || "Not Set",
          address: data.address || "Main Office",
          avatarUrl: data.avatarUrl || "",
        }));
      }

      // Map dynamic stats from response arrays
      const orderData = await ordersRes.json();
      const reviewData = await reviewsRes.json();

      setStats({
        orders: Array.isArray(orderData) ? orderData.length.toString() : "0",
        growth: reviewData.positivePercentage
          ? `+${reviewData.positivePercentage}%`
          : "14%",
        status: "Online",
      });
    } catch (err) {
      console.error("Profile Sync Error:", err);
    } finally {
      setLoading(false);
      setMounted(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Multipart Update for Profile and Image
  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    const token = localStorage.getItem("token");

    const requestBody = {
      fullName: profile.name,
      phone: profile.phone,
      address: profile.address,
    };

    // Correct Multipart naming from Swagger: 'request' and 'image'
    formData.append(
      "request",
      new Blob([JSON.stringify(requestBody)], { type: "application/json" }),
    );
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE}/admin/profile/${profile.userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setEditMode(false);
        setPreviewUrl(null);
        fetchData();
      }
    } catch (err) {
      alert("Save failed. Check Port 8082 status.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  const avatarSrc =
    previewUrl ||
    (profile.avatarUrl ? `http://localhost:8082${profile.avatarUrl}` : null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12">
      <div
        className={`max-w-6xl mx-auto transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Admin <span className="text-blue-600">Profile</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Node ID: {profile.userId}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold text-xs uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : editMode ? (
                <Save size={14} />
              ) : (
                <Edit2 size={14} />
              )}
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* AVATAR CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center relative">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="w-full h-full rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 overflow-hidden flex items-center justify-center text-4xl font-black text-blue-600">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name.charAt(0)
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl border-4 border-white shadow-xl"
                  >
                    <Camera size={18} />
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
              <h2 className="text-xl font-black text-slate-800">
                {profile.name}
              </h2>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-1">
                System Administrator
              </p>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
              <CheckCircle2 className="text-emerald-500" />
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-tight">
                Security Verified
              </p>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
              <DetailItem
                icon={Mail}
                label="System Email"
                val={profile.email}
              />
              <DetailItem
                icon={Phone}
                label="Contact Phone"
                val={profile.phone}
                editable={editMode}
                onChange={(v) => setProfile({ ...profile, phone: v })}
              />
              <DetailItem
                icon={MapPin}
                label="Base Station"
                val={profile.address}
                editable={editMode}
                onChange={(v) => setProfile({ ...profile, address: v })}
              />
              <DetailItem
                icon={Clock}
                label="Operational Zone"
                val="GMT +7 (Cambodia)"
              />
            </div>

            {/* DYNAMIC STATS */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard icon={Package} label="Orders" val={stats.orders} />
              <StatCard icon={TrendingUp} label="Growth" val={stats.growth} />
              <StatCard
                icon={Zap}
                label="Pulse"
                val={stats.status}
                color="text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, val, editable, onChange }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Icon size={12} className="text-blue-500" /> {label}
      </p>
      {editable ? (
        <input
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
        />
      ) : (
        <p className="text-sm font-bold text-slate-700 border-l-4 border-blue-600 pl-4">
          {val}
        </p>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, val, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
      <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon size={18} className="text-blue-500" />
      </div>
      <p className={`text-2xl font-black ${color || "text-slate-900"}`}>
        {val}
      </p>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  );
}
