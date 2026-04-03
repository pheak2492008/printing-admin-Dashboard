import { useState, useEffect, useRef } from "react";
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
  Activity,
  Package,
} from "lucide-react";

const API_BASE = "http://localhost:8081/api/v1/profile";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // ── Profile State ──
  const [profile, setProfile] = useState({
    id: 1,
    name: "Loading...",
    role: "Staff",
    email: "",
    phone: "",
    staffId: "---",
    profileImageUrl: "", // Store the image path from backend
    ordersProcessed: "0",
    rating: "0.0",
    onTimeRate: "0%",
    activeSince: "---",
  });

  // ── 1. Fetch Profile Data ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId") || "1";
        const response = await fetch(`${API_BASE}/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            name: data.fullName,
            role: data.position,
            email: data.email,
            phone: data.phoneNumber,
            staffId: data.staffCode,
            profileImageUrl: data.profileImageUrl, // Assume this field exists in Java
            ordersProcessed: data.totalOrders?.toLocaleString() || "1,842",
            rating: data.averageRating || "4.9",
            onTimeRate: (data.onTimePercentage || "98") + "%",
            activeSince: data.joinDate || "Jan 2022",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── 2. Handle Image Upload & Profile Update ──
  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();

    // Append text data
    formData.append("fullName", profile.name);
    formData.append("position", profile.role);
    formData.append("phoneNumber", profile.phone);
    formData.append("email", profile.email);

    // Append file if selected
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(`${API_BASE}/${profile.id}`, {
        method: "PUT",
        // Note: Don't set Content-Type header when sending FormData;
        // the browser sets it automatically with the boundary string.
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile((prev) => ({
          ...prev,
          profileImageUrl: updatedData.profileImageUrl,
        }));
        setEditMode(false);
        alert("Profile & Image Updated!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.email)
    return (
      <div className="p-20 text-center animate-pulse">Loading Profile...</div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="font-bold text-xl">Profile Settings</h1>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            editMode ? "bg-green-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {editMode ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="px-6 pb-6 relative">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              {/* Avatar Image Upload */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-slate-200 overflow-hidden">
                  {profile.profileImageUrl ? (
                    <img
                      src={`http://localhost:8081${profile.profileImageUrl}`}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>

                {editMode && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        // Optional: Create a local preview URL
                        if (e.target.files?.[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setProfile({ ...profile, profileImageUrl: url });
                        }
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="text-white" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex-1">
                {editMode ? (
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="text-xl font-bold border-b border-blue-500 outline-none w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                )}
                <p className="text-sm text-slate-400">{profile.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatItem
                icon={Package}
                value={profile.ordersProcessed}
                label="Orders"
                color="text-blue-500"
              />
              <StatItem
                icon={Star}
                value={profile.rating}
                label="Rating"
                color="text-amber-500"
              />
              <StatItem
                icon={CheckCircle2}
                value={profile.onTimeRate}
                label="On-Time"
                color="text-emerald-500"
              />
              <StatItem
                icon={Clock}
                value={profile.activeSince}
                label="Since"
                color="text-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Contact Information
          </h3>
          <div className="space-y-4">
            <InfoField icon={Mail} label="Email" value={profile.email} />
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Smartphone size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">Phone</p>
                {editMode ? (
                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="text-sm font-bold border-b border-slate-200 outline-none w-full"
                  />
                ) : (
                  <p className="text-sm font-bold">{profile.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const StatItem = ({ icon: Icon, value, label, color }: any) => (
  <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
    <Icon size={16} className={`${color} mx-auto mb-1`} />
    <p className="text-sm font-bold">{value}</p>
    <p className="text-[10px] text-slate-400">{label}</p>
  </div>
);

const InfoField = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-4">
    <div className="p-2 bg-slate-50 rounded-lg">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);
