import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Search,
  CheckCircle2,
  MoreHorizontal,
  ThumbsUp,
  Loader2,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

const API_BASE = "http://localhost:8081/api/v1/reviews";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  productName: string;
  createdAt: string;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  positivePercentage: number;
  responseRate: number;
}

export default function ReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const [sumRes, allRes] = await Promise.all([
          fetch(`${API_BASE}/summary`, { headers }),
          fetch(`${API_BASE}/all`, { headers }),
        ]);

        // Check if both responses are okay
        if (!sumRes.ok || !allRes.ok) {
          throw new Error(
            `API Error: Summary(${sumRes.status}) All(${allRes.status})`,
          );
        }

        const sumData = await sumRes.json();
        const allData = await allRes.json();

        setSummary(sumData);
        setReviews(Array.isArray(allData) ? allData : []);
      } catch (err: any) {
        console.error("Fetch failure:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Loading State
  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  // 2. Error State (Prevents Blank Screen if API fails)
  if (error)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertTriangle className="text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-900">Connection Failed</h2>
        <p className="text-slate-500 max-w-sm mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700"
        >
          Retry Connection
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Customer <span className="text-blue-600">Feedback</span>
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* STAT CARDS - Using Optional Chaining (?.) to prevent crashes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          <StatCard
            label="Avg Rating"
            val={summary?.averageRating?.toFixed(1) ?? "0.0"}
            icon={Star}
            color="text-amber-500"
            bg="bg-amber-50"
          />
          <StatCard
            label="Total Reviews"
            val={summary?.totalReviews?.toString() ?? "0"}
            icon={MessageSquare}
            color="text-blue-600"
            bg="bg-blue-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* REVIEWS LIST */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">
              Recent Activity
            </h3>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-blue-600">
                        {review.customerName?.charAt(0) ?? "U"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {review.customerName ?? "Anonymous"}
                        </h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 italic border-l-4 border-slate-50 pl-4 mb-4">
                    "{review.comment ?? "No comment provided."}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">
                      {review.productName ?? "General"}
                    </span>
                    <button className="text-[10px] font-black text-white bg-slate-900 px-5 py-2 rounded-xl hover:bg-blue-600">
                      REPLY
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-medium">No reviews yet.</p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-8 h-fit shadow-sm">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">
              Internal Notes
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                  Tip: Respond to 1-star reviews within 24 hours to improve
                  customer retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}
      >
        <Icon size={20} className={color} />
      </div>
      <div className="text-2xl font-black text-slate-900">{val}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}
