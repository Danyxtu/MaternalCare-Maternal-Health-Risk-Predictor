import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, RefreshCw, Plus, Trash2, ShieldCheck, User as UserIcon, Activity, UserPlus, Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedIdUrl, setSelectedIdUrl] = useState(null);
  
  // Add Admin Form State
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/admin/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);
      if (action === "approve" || action === "reject") {
        // Find the doctor record for this user
        const targetUser = users.find(u => u.id === id);
        if (targetUser && targetUser.doctor) {
          await axios.put(`http://localhost:3000/api/admin/doctors/${targetUser.doctor.id}/${action}`);
        }
      } else if (action === "delete") {
        await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      }
      await fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user.`, error);
      const msg = error.response?.data?.message || `Failed to ${action} user.`;
      setErrorMessage(msg);
      setIsErrorOpen(true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      await axios.post("http://localhost:3000/api/admin/admins", adminForm);
      setIsAddAdminOpen(false);
      setIsSuccessOpen(true);
      setAdminForm({ email: "", password: "", first_name: "", last_name: "" });
      await fetchUsers();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to create admin");
    } finally {
      setFormLoading(false);
    }
  };

  const openPreview = (url) => {
    if (!url) return;
    setSelectedIdUrl(`http://localhost:3000${url}`);
    setIsPreviewOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === "ALL" || user.role === activeTab;
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${styles[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
        {status}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const styles = {
      ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200",
      DOCTOR: "bg-blue-50 text-blue-700 border-blue-200",
      PATIENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const icons = {
      ADMIN: <ShieldCheck size={12} className="mr-1" />,
      DOCTOR: <Activity size={12} className="mr-1" />,
      PATIENT: <UserIcon size={12} className="mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${styles[role]}`}>
        {icons[role]}
        {role}
      </span>
    );
  };

  const canDelete = (targetUser) => {
    if (targetUser.email === "admin@test.com") return false;
    if (targetUser.role === "ADMIN") {
      return currentUser?.email === "admin@test.com";
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-[15px]">Manage access control and verify medical professional credentials.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setIsAddAdminOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[14px] font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <UserPlus size={18} />
            <span>Add Admin</span>
          </button>
        </div>
      </header>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto p-1 bg-slate-100 rounded-2xl flex border border-slate-200">
          {["ALL", "ADMIN", "DOCTOR", "PATIENT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}s
            </button>
          ))}
        </div>
        <div className="w-full md:max-w-xs relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[14px] outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">User</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Role</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">ID Verification</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Joined Date</th>
                <th className="px-6 py-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-slate-300" />
                      <span className="font-medium">Loading user database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={24} className="text-slate-300" />
                      <span className="font-medium">No users match your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.first_name} {user.last_name}</span>
                        <span className="text-slate-500 text-[12px]">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-6 py-4">
                      {user.role === "DOCTOR" ? (
                        <StatusBadge status={user.doctor?.status} />
                      ) : (
                        <span className="text-slate-400 text-[12px] italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "DOCTOR" ? (
                        <button 
                          onClick={() => openPreview(user.doctor?.id_card_url)}
                          className={`text-[13px] font-bold transition-all ${user.doctor?.id_card_url ? "text-indigo-600 hover:text-indigo-800 hover:underline" : "text-slate-300 cursor-not-allowed"}`}
                          disabled={!user.doctor?.id_card_url}
                        >
                          {user.doctor?.id_card_url ? "View Document" : "No Document"}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[12px] italic">Not required</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[13px] font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {user.role === "DOCTOR" && user.doctor?.status === "PENDING" && (
                          <>
                            <button 
                              onClick={() => handleAction(user.id, "approve")}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Approve Doctor"
                              disabled={actionLoading === user.id}
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleAction(user.id, "reject")}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Reject Doctor"
                              disabled={actionLoading === user.id}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        {canDelete(user) && (
                          <button 
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="p-2 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                            title="Delete User"
                            disabled={actionLoading === user.id}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {!canDelete(user) && user.email === "admin@test.com" && (
                           <span className="p-2 text-amber-500" title="Main Admin (Protected)">
                             <ShieldCheck size={18} />
                           </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[22px] font-bold text-slate-900">Add New Admin</h3>
                  <p className="text-slate-500 text-[14px]">Grant administrative access to the platform.</p>
                </div>
                <button 
                  onClick={() => setIsAddAdminOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 ml-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={adminForm.first_name}
                      onChange={(e) => setAdminForm({...adminForm, first_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={adminForm.last_name}
                      onChange={(e) => setAdminForm({...adminForm, last_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                    placeholder="jane.doe@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Temporary Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[13px] font-medium flex gap-2 items-center animate-in slide-in-from-top-2">
                    <X size={16} />
                    {formError}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddAdminOpen(false)}
                    className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    {formLoading ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Confirmation Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-[22px] font-bold text-slate-900 mb-2">Admin Created</h3>
              <p className="text-slate-500 text-[15px] mb-8">The new administrative account has been successfully registered and is ready for use.</p>
              <button 
                onClick={() => setIsSuccessOpen(false)}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-[22px] font-bold text-slate-900 mb-2">Delete User?</h3>
              <p className="text-slate-500 text-[15px] mb-8">
                Are you sure you want to remove <span className="font-bold text-slate-900">{userToDelete?.first_name} {userToDelete?.last_name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAction(userToDelete?.id, "delete")}
                  disabled={actionLoading === userToDelete?.id}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                >
                  {actionLoading === userToDelete?.id ? <RefreshCw size={18} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isErrorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={40} />
              </div>
              <h3 className="text-[22px] font-bold text-slate-900 mb-2">Action Failed</h3>
              <p className="text-slate-500 text-[15px] mb-8">{errorMessage}</p>
              <button 
                onClick={() => setIsErrorOpen(false)}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[18px] font-bold text-slate-900">Credential Verification</h3>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-auto bg-slate-50/50 flex justify-center items-center">
              <img 
                src={selectedIdUrl} 
                alt="Doctor ID" 
                className="max-w-full rounded-2xl shadow-xl border border-slate-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=ID+Image+Not+Found";
                }}
              />
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
