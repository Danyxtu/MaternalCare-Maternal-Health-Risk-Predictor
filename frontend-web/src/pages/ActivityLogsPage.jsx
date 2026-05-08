import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  History, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  UserMinus, 
  Activity as ActivityIcon,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const ActivityLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/admin/activities?limit=100");
      setActivities(response.data.data);
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "ADMIN_CREATED": return <ShieldCheck className="text-indigo-500" size={18} />;
      case "USER_REGISTERED": return <UserPlus className="text-blue-500" size={18} />;
      case "DOCTOR_APPROVED": return <UserCheck className="text-emerald-500" size={18} />;
      case "DOCTOR_REJECTED": return <UserMinus className="text-rose-500" size={18} />;
      case "USER_DELETED": return <UserMinus className="text-slate-500" size={18} />;
      case "PROFILE_UPDATED": return <History className="text-amber-500" size={18} />;
      default: return <ActivityIcon className="text-slate-400" size={18} />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = activeFilter === "ALL" || activity.type.includes(activeFilter);
    const matchesSearch = 
      activity.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (activity.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <History className="text-slate-400" size={32} />
            Activity Logs
          </h1>
          <p className="text-slate-500 text-[15px] font-medium">Audit trail of all administrative and system events.</p>
        </div>
        <button 
          onClick={fetchActivities}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto p-1 bg-white/50 backdrop-blur-md rounded-2xl flex border border-white/40 shadow-sm">
          {["ALL", "USER", "DOCTOR", "ADMIN"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                activeFilter === filter 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {filter === "ALL" ? "All Events" : filter.charAt(0) + filter.slice(1).toLowerCase() + "s"}
            </button>
          ))}
        </div>
        
        <div className="w-full md:max-w-xs relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl text-[14px] font-medium outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Event</th>
                <th className="px-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">User Context</th>
                <th className="px-8 py-5 text-[12px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw size={32} className="animate-spin text-slate-200" />
                      <span className="text-slate-400 font-bold">Synchronizing audit trail...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Filter size={32} className="text-slate-200" />
                      <span className="text-slate-400 font-bold">No activity logs found matching your filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-tight">
                            {activity.message}
                          </p>
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100/50 px-2 py-0.5 rounded mt-1 inline-block">
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-[14px]">
                        <ActivityIcon size={14} className="text-slate-300" />
                        {activity.email || "System Level"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[14px] font-black text-slate-900 tracking-tight">
                          {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(activity.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        {!loading && filteredActivities.length > 0 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-500">
              Showing {filteredActivities.length} recent events
            </span>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 cursor-not-allowed">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 cursor-not-allowed">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
