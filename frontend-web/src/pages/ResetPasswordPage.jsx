import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import AppLogo from "../components/AppLogo";
import api from "../services/api.js";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";
  const otpParam = searchParams.get("otp") || "";
  const methodParam = searchParams.get("method") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(otpParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isOtpMethod = methodParam === "otp" || !!otpParam;

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        email,
        token: tokenParam,
        otp,
        password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Link/code may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-2">
        <div className="bg-white rounded-[24px] shadow-xl p-8 w-full max-w-[400px] text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
          <p className="text-slate-500 mb-6">Your password has been updated successfully.</p>
          <p className="text-sm text-slate-400">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-2 font-sans overflow-hidden">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-5 md:p-6">
          <div className="flex flex-col items-center mb-4">
            <AppLogo size={100} borderColor="#E11D48" borderWidth={3} imageScale={1.5} />
            <h2 className="text-xl font-bold text-slate-900 mt-4 tracking-tight">Set New Password</h2>
            <p className="text-slate-500 font-medium text-[12px] text-center mt-1">
              Please enter your verification details and new password.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] mb-4">
              <AlertCircle size={14} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-3.5">
            {!emailParam && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[40px] px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48] text-sm"
                  required
                />
              </div>
            )}

            {isOtpMethod && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full h-[40px] px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48] text-sm tracking-[0.5em] font-bold text-center"
                  maxLength={6}
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[40px] px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48] text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[40px] px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48] text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-[#E11D48] text-white rounded-xl font-bold shadow-lg shadow-[#E11D48]/20 hover:bg-[#be123c] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-[12px] font-bold text-slate-500 hover:text-[#E11D48] flex items-center justify-center gap-1">
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
