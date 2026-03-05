import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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

      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );

      // store JWT
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">

      {/* animated background glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />

      {/* glass card */}
      <div
        className={`relative z-10 w-[380px] p-8 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
        transform transition-all duration-700
        ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-white/70 mb-6">
          Sign in to OpsMind AI
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-white/70">Email</label>
          <input
            onKeyDown={handleKeyDown}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white
                       placeholder-white/60 outline-none
                       focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="text-sm text-white/70">Password</label>
          <input
            onKeyDown={handleKeyDown}
            type={show ? "text" : "password"}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white
                       placeholder-white/60 outline-none
                       focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-9 text-xs text-white/70 hover:text-white transition"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold tracking-wide transition
          ${loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 active:scale-95"
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
