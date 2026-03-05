import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // auto-redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
    setMounted(true);
  }, []);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:8000/api/auth/register", form);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">

      {/* background glow blobs */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />

      {/* glass card */}
      <div
        className={`relative z-10 w-[400px] p-8 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
        transform transition-all duration-700
        ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          Create Account
        </h2>
        <p className="text-center text-sm text-white/70 mb-6">
          Join OpsMind AI
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-white/70">Full Name</label>
          <input
            name="name"
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white
                       placeholder-white/60 outline-none
                       focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Your name"
            value={form.name}
            onChange={change}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-white/70">Email</label>
          <input
            name="email"
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white
                       placeholder-white/60 outline-none
                       focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="you@company.com"
            value={form.email}
            onChange={change}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="text-sm text-white/70">Password</label>
          <input
            type={show ? "text" : "password"}
            name="password"
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white
                       placeholder-white/60 outline-none
                       focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="••••••••"
            value={form.password}
            onChange={change}
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
          onClick={register}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold tracking-wide transition
          ${loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 active:scale-95"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-300 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
