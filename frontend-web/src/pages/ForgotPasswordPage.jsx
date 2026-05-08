import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, Hash, AlertCircle, CheckCircle2 } from "lucide-react";
import AppLogo from "../components/AppLogo";
import api from "../services/api.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendRequest = async (method) => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/auth/forgot-password", { email, method });
      
      if (method === "otp") {
        navigate(`/reset-password?email=${email}&method=otp`);
      } else {
        setMessage("A password reset link has been sent to your email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-2 font-sans overflow-hidden">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-5 md:p-6">
          <div className="flex flex-col items-center mb-4">
            <AppLogo size={100} borderColor="#E11D48" borderWidth={3} imageScale={1.5} />
            <h2 className="text-xl font-bold text-slate-900 mt-4 tracking-tight">Forgot Password?</h2>
            <p className="text-slate-500 font-medium text-[12px] text-center mt-1">
              Choose how you want to reset your password.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] mb-4">
              <AlertCircle size={14} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-100 rounded-lg text-green-600 text-[11px] mb-4">
              <CheckCircle2 size={14} className="shrink-0" />
              <span className="font-medium">{message}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E11D48] transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[44px] pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  />              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSendRequest("link")}
                disabled={loading}
                className="w-full h-[48px] bg-[#E11D48] text-white rounded-xl font-bold shadow-lg shadow-[#E11D48]/20 hover:bg-[#be123c] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Send Reset Link</span>
              </button>

              <button
                onClick={() => handleSendRequest("otp")}
                disabled={loading}
                className="w-full h-[48px] bg-slate-100 text-[#E11D48] border border-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Hash size={16} />
                <span>Send OTP Code</span>
              </button>
            </div>
          </div>

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

export default ForgotPasswordPage;
