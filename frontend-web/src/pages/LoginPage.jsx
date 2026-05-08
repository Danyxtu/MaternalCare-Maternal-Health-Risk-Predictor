import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppLogo from "../components/AppLogo";

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
    <div className="min-h-screen max-h-screen bg-slate-200 flex items-center justify-center p-2 font-sans overflow-hidden">
      <div className="w-full max-w-[400px]">
        {/* Main Card */}
        <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/60 border border-slate-100 p-5 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-3">
            <div 
              className="flex items-center justify-center mb-2"
            >
              <AppLogo size={100} borderColor="#E11D48" backgroundColor="transparent" borderWidth={3} imageScale={1.5} />
            </div>
            <h1 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">MaternalCare</h1>

            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium text-[12px]">
                Please enter your details to sign in.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={12} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] transition-colors" size={14} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[40px] pl-9 pr-4 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-[13px] font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] transition-colors" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-[40px] pl-9 pr-9 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-[13px] font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[#E11D48] text-[10px] font-bold hover:text-[#be123c] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] bg-[#E11D48] text-white rounded-lg font-bold shadow-lg shadow-[#E11D48]/20 hover:bg-[#be123c] hover:shadow-[#E11D48]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium">Don't have an account?</span>
              <button className="text-[#E11D48] font-bold hover:text-[#be123c] transition-colors">
                Create Account
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 w-full flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={10} />
                <span className="text-[8px] uppercase tracking-[0.12em] font-bold">
                  Admin Portal Secure Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-4 text-center text-slate-400 text-[8px] font-bold uppercase tracking-[0.15em]">
          Maternal Health Monitoring System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
