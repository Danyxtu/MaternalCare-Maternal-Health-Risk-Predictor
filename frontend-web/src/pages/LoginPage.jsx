import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Lock, Mail, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials or unauthorized access.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px]">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-20 h-20 rounded-[22px] flex items-center justify-center mb-6 shadow-lg shadow-[#FB1554]/20"
              style={{ backgroundColor: "#FB1554" }}
            >
              <Heart size={40} fill="white" color="white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">MaternalCare</h1>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">
                Please enter your details to sign in.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[54px] pl-12 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-[54px] pl-12 pr-12 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-[#E11D48] text-sm font-bold hover:text-[#be123c] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] bg-[#E11D48] text-white rounded-2xl font-bold shadow-lg shadow-[#E11D48]/20 hover:bg-[#be123c] hover:shadow-[#E11D48]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-500 font-medium">Don't have an account?</span>
              <button className="text-[#E11D48] font-bold hover:text-[#be123c] transition-colors">
                Create Account
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 w-full flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={16} />
                <span className="text-[11px] uppercase tracking-[0.1em] font-bold">
                  Admin Portal Secure Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          Maternal Health Monitoring System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
