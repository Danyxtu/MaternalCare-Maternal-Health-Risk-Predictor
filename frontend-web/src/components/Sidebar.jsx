import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, User, Settings, History, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppLogo from "./AppLogo";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <aside className="w-[230px] min-w-[230px] bg-[#0f172a] text-white flex flex-col h-screen fixed">
        <div className="p-[24px_20px_20px] flex items-center gap-[10px] border-b border-white/10">
          <div className="w-[40px] h-[40px] flex items-center justify-center">
            <AppLogo size={40} borderColor="#E11D48" borderWidth={2} imageScale={1.1} />
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
            onClick={handleLogoutClick} 
            className="flex items-center gap-[10px] p-[10px_12px] rounded-[10px] text-[13px] font-medium text-[#94a3b8] hover:text-[#fca5a5] hover:bg-rose-500/10 w-full transition-all duration-150 mt-2"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[360px] shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <LogOut className="text-[#e11d48]" size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
                Are you sure you want to log out of your account?
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full py-3.5 bg-[#e11d48] text-white rounded-2xl font-bold hover:bg-[#be123c] transition-colors shadow-lg shadow-rose-500/20"
                >
                  Okay, logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Cancel, stay logged in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
