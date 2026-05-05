import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Shield, Calendar, MapPin, Phone, Edit2, Camera, Loader2, CheckCircle2, Save, X } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    middle_initial: ""
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/auth/profile");
      const user = response.data.user;
      setProfile(user);
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        middle_initial: user.middle_initial || ""
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await axios.put("http://localhost:3000/api/auth/profile", formData);
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-slate-900" />
        <span className="font-medium">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Admin Profile</h1>
        <p className="text-slate-500 text-[16px] font-medium">View and manage your personal information.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        {/* Cover/Header Section */}
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl">
              <div className="w-full h-full rounded-[22px] bg-slate-100 flex items-center justify-center text-slate-400 relative group cursor-pointer">
                <User size={48} />
                <div className="absolute inset-0 bg-black/40 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 p-8 pb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">First Name</label>
                    <input 
                      type="text" 
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-[16px] font-semibold text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-[16px] font-semibold text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <h2 className="text-[28px] font-bold text-slate-900">
                  {profile?.first_name} {profile?.last_name}
                </h2>
              )}
              
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-[12px] font-bold rounded-full border border-indigo-100">
                  <Shield size={14} className="mr-1.5" />
                  System Administrator
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-[12px] font-bold rounded-full border border-emerald-100">
                  <CheckCircle2 size={14} className="mr-1.5" />
                  Verified
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-semibold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[14px] font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95 disabled:opacity-70"
                  >
                    {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[14px] font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-slate-900 mb-4">Account Information</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full mt-1 px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-[15px] font-semibold text-slate-700 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
                    />
                  ) : (
                    <p className="text-[15px] font-semibold text-slate-700">{profile?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-[15px] font-semibold text-slate-700">
                    {new Date(profile?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-slate-900 mb-4">Contact Details</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-[15px] font-semibold text-slate-700">+63 912 345 6789</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-[15px] font-semibold text-slate-700">Manila, Philippines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white">
          <h3 className="text-[20px] font-bold mb-2">Security Level</h3>
          <p className="text-indigo-100 text-[14px] mb-6">Your account is secured with two-factor authentication.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[85%]"></div>
            </div>
            <span className="text-[14px] font-bold text-white">85%</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-[20px] font-bold text-slate-900 mb-2">Activity Log</h3>
          <p className="text-slate-500 text-[14px] mb-4">View your recent login attempts and actions.</p>
          <button className="text-indigo-600 text-[14px] font-bold hover:underline">View History →</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
