import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
      {/* glowing background */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-pulse" />

      {/* login card */}
      <div
        className={`relative z-10 w-[400px] p-8 rounded-2xl
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
        transform transition-all duration-700
        ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/Icon.jpeg"
            alt="OpsMind AI"
            className="w-16 h-16 rounded-xl shadow-lg"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h2>

        <p className="text-center text-sm text-white/70 mb-6">
          Login to <span className="text-indigo-300">OpsMind AI</span>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">{error}</div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-white/70">Email</label>

          <div className="relative mt-1">
            <FiMail className="absolute left-3 top-3 text-white/60" />

            <input
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/60 outline-none
              focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-white/70">Password</label>

          <div className="relative mt-1">
            <FiLock className="absolute left-3 top-3 text-white/60" />

            <input
              type={show ? "text" : "password"}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-16 py-2 rounded-lg bg-white/20 text-white
              placeholder-white/60 outline-none
              focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-2 text-xs text-white/70 hover:text-white"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold tracking-wide
          transition-all duration-200
          ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95"
          }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-300 hover:underline cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
