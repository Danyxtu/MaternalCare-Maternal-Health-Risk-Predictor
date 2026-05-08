import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Activity as ActivityIcon, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  UserMinus,
  ArrowRight
} from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    pendingDoctors: 0,
    approvedDoctors: 0,
    totalPatients: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/stats"),
        axios.get("http://localhost:3000/api/admin/activities?limit=10")
      ]);
      setStats(statsRes.data.data);
      setActivities(activityRes.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[24px] p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
      {/* Decorative Background Glow */}
      <div className={`absolute -right-4 -top-4 w-20 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorClass.split(' ')[0]}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-all duration-500 group-hover:rotate-6 ${colorClass}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[11px] font-extrabold tracking-tight border border-emerald-500/10">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-[13px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{title}</div>
        <div className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{value}</div>
      </div>
    </div>
  );

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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <span className="font-medium animate-pulse">Syncing dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 text-[16px] font-medium">Real-time health of the Maternal Care ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <Clock size={16} />
          <span className="text-[13px] font-bold">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Doctors" 
          value={stats.totalDoctors} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600" 
          trend="+4%"
        />
        <StatCard 
          title="Pending Approval" 
          value={stats.pendingDoctors} 
          icon={UserPlus} 
          colorClass="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Active Professionals" 
          value={stats.approvedDoctors} 
          icon={UserCheck} 
          colorClass="bg-emerald-50 text-emerald-600" 
          trend="+12%"
        />
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users} 
          colorClass="bg-rose-50 text-rose-600" 
          trend="+8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[20px] font-bold text-slate-900 flex items-center gap-2">
              <ActivityIcon size={20} className="text-slate-400" />
              Recent Activity
            </h2>
            <Link to="/logs" className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              View Audit Log <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[28px] overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="divide-y divide-slate-100/50">
              {activities.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-bold text-[13px]">
                  No recent activities recorded.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="p-5 flex items-center gap-4 hover:bg-white transition-all duration-300 group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 group-hover:rotate-3 transition-all shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-extrabold text-slate-900 truncate tracking-tight">
                        {activity.message}
                      </p>
                      <p className="text-[12px] text-slate-500 font-bold truncate opacity-70">
                        {activity.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 whitespace-nowrap bg-slate-100/50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                        {getTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats or Tips */}
        <div className="space-y-5">
          <h2 className="text-[18px] font-bold text-slate-900 px-1 flex items-center gap-2">
            <ShieldCheck size={18} className="text-slate-400" />
            System Health
          </h2>
          <div className="bg-slate-900 rounded-[28px] p-7 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <ShieldCheck className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-[20px] font-black mb-1.5 tracking-tight leading-tight">Secure & Compliant</h3>
              <p className="text-indigo-100/60 text-[13px] leading-relaxed mb-6 font-medium">
                End-to-end encryption active. Platform is HIPAA & GDPr compliant.
              </p>
              <div className="space-y-3">
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 w-[100%] rounded-full shadow-[0_0_12px_rgba(129,140,248,0.6)]"></div>
                </div>
                <div className="flex justify-between text-[11px] font-black text-indigo-200/40 uppercase tracking-widest">
                  <span>Trust Score</span>
                  <span>Optimized</span>
                </div>
              </div>
            </div>
            {/* Animated Decorative Gradients */}
            <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-[70px] group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[28px] p-7 shadow-lg shadow-slate-200/50 group">
            <h3 className="text-[16px] font-black text-slate-900 mb-5 flex items-center gap-3">
              <Clock className="text-amber-500" size={18} />
              Pending Tasks
            </h3>
            <div className="space-y-5">
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 group-hover:bg-amber-500/10 transition-colors duration-300">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                  <span className="text-[14px] font-black text-amber-700">{stats.pendingDoctors} Doctors</span>
                </div>
                <p className="text-[12px] text-amber-900/60 leading-relaxed font-bold">
                  Awaiting credential verification
                </p>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[13px] hover:bg-black transition-all active:scale-95 shadow-md">
                Review Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
