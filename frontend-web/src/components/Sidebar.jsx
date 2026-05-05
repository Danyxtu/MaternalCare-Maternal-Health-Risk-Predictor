import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Heart, User, Settings, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[230px] min-w-[230px] bg-[#0f172a] text-white flex flex-col h-screen fixed">
      <div className="p-[24px_20px_20px] flex items-center gap-[10px] border-b border-white/10">
        <div className="w-[32px] h-[32px] flex items-center justify-center">
          <Heart className="w-[28px] h-[28px] text-[#e11d48] fill-[#e11d48]" />
        </div>
        <div className="text-[14px] font-medium text-white leading-[1.3]">
          MaternalCare<br />
          <span className="text-[11px] text-[#64748b] font-normal">Admin Portal</span>
        </div>
      </div>
      
      <nav className="flex-1 p-[16px_12px] flex flex-col gap-[4px]">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
              isActive 
                ? "bg-[#e11d48] text-white" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/users" 
          className={({ isActive }) => 
            `flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
              isActive 
                ? "bg-[#e11d48] text-white" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Users size={18} className="shrink-0" />
          <span>User Management</span>
        </NavLink>

        <NavLink 
          to="/logs" 
          className={({ isActive }) => 
            `flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
              isActive 
                ? "bg-[#e11d48] text-white" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <History size={18} className="shrink-0" />
          <span>Activity Logs</span>
        </NavLink>
      </nav>

      <div className="p-[14px_12px] border-t border-white/10 space-y-1">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
              isActive 
                ? "bg-white/10 text-white" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <User size={18} className="shrink-0" />
          <span>Profile</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
              isActive 
                ? "bg-white/10 text-white" 
                : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Settings size={18} className="shrink-0" />
          <span>Settings</span>
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium text-[#94a3b8] hover:text-[#fca5a5] hover:bg-rose-500/10 w-full transition-all duration-150 mt-2"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
