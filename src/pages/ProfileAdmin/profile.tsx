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
    userId: localStorage.getItem("userId") || "",
    name: "",
    phone: "",
    address: "",
    avatarUrl: "",
    email: localStorage.getItem("userEmail") || "",
  });

  // Helper to get token safely
  const getAuthToken = () =>
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  // --- FETCH DATA (GET by ID) ---
  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    // CRITICAL: Check if userId is actually a number/string and not "undefined"
    if (!token || !userId || userId === "undefined") {
      console.error("No valid User ID found in storage!");
      setLoading(false);
      setMounted(true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/v1/admin/profile/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setProfile({
          userId: userId,
          name: data.fullName || "Admin",
          phone: data.phone || "",
          address: data.address || "",
          avatarUrl: data.avatarUrl || "",
          email: data.email || localStorage.getItem("userEmail") || "",
        });
      } else {
        console.error("Server responded with:", res.status);
      }
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setLoading(false);
      setMounted(true);
    }
  };
  useEffect(() => {
    // Run the fetch
    fetchProfile();

    // Trigger the entry animation
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

    // Match your @RequestPart("request") ProfileRequest exactly
    const profileRequest = {
      fullName: profile.name,
      phone: profile.phone,
      address: profile.address,
    };

    // WRAP JSON IN BLOB: This prevents "413 Unsupported Media Type" or "403"
    formData.append(
      "request",
      new Blob([JSON.stringify(profileRequest)], { type: "application/json" }),
    );

    // IMAGE PART
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE}/${profile.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set 'Content-Type': 'multipart/form-data' manually.
          // The browser must do it to include the "boundary" string.
        },
        body: formData,
      });

      if (res.ok) {
        setEditMode(false);
        await fetchProfile(); // Refresh UI with new data
        alert("Profile updated!");
      } else {
        const errorText = await res.text();
        console.error("Save failed:", errorText);
        alert(`Error ${res.status}: Check permissions or network.`);
      }
    } catch (err) {
      alert("Server unreachable.");
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
  const initials =
    profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

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
            <p className="text-slate-500 font-medium">
              Enterprise Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            {editMode ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-2xl shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Confirm Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold uppercase rounded-2xl border border-slate-200 shadow-sm"
              >
                <Edit2 size={16} /> Modify
              </button>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PROFILE CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] text-center shadow-sm">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="w-full h-full rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-5xl font-black text-blue-600 overflow-hidden shadow-inner">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    initials
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl border-4 border-white text-white shadow-lg hover:scale-110 transition-transform"
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
                  className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-600 outline-none pb-1"
                />
              ) : (
                <h2 className="text-2xl font-black text-slate-900">
                  {profile.name || "Admin"}
                </h2>
              )}
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                Senior Administrator
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <h3 className="text-slate-900 text-xs font-black uppercase mb-4 flex items-center gap-2">
                <Shield size={16} className="text-blue-600" /> System Clearances
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <CheckCircle2 size={14} className="text-blue-600" /> Full API
                  Access
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <InfoItem
                icon={Mail}
                label="Email Contact"
                value={profile.email}
              />
              <InfoItem
                icon={Phone}
                label="Direct Phone"
                value={profile.phone}
                editable={editMode}
                onChange={(v: string) => setProfile({ ...profile, phone: v })}
              />
              <InfoItem
                icon={Clock}
                label="Operational Timezone"
                value="GMT+7"
              />
              <InfoItem
                icon={MapPin}
                label="Assigned Office"
                value={profile.address}
                editable={editMode}
                onChange={(v: string) => setProfile({ ...profile, address: v })}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon={Package} label="Orders" val="1.2k" />
              <StatBox icon={Users} label="Staff" val="12" />
              <StatBox icon={TrendingUp} label="Growth" val="+14%" />
              <StatBox icon={Zap} label="Status" val="Active" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
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
        <Icon size={14} /> {label}
      </div>
      {editable && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-600"
        />
      ) : (
        <p className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-4">
          {value || "N/A"}
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
    <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center shadow-sm">
      <Icon size={20} className="text-blue-600 mx-auto mb-2" />
      <p className="text-xl font-black text-slate-900">{val}</p>
      <p className="text-[9px] text-slate-400 font-black uppercase">{label}</p>
    </div>
  );
}
