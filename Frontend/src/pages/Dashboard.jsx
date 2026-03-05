import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatUI from "../components/ChatUI";
import History from "../components/History";
import { getStats } from "../services/stats";
import { getProfile } from "../services/profile";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoadingUser(false));

    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  }, []);

  // 🔥 Called after each successful chat
  const handleNewChat = (question, answer) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        question,
        answer,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    // 📈 refresh stats live
    getStats().then(setStats);
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-2">OpsMind AI</h2>

        {loadingUser ? (
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-6" />
        ) : (
          user && <p className="text-sm text-white/60 mb-6">{user.name}</p>
        )}

        <nav className="space-y-4 text-white/80 flex-1">
          <p className="cursor-pointer hover:text-white">Dashboard</p>
          <p className="cursor-pointer hover:text-white">Chat</p>
          <p className="cursor-pointer hover:text-white">History</p>
        </nav>

        <p
          onClick={logout}
          className="cursor-pointer text-red-400 hover:text-red-500 mt-6"
        >
          Logout
        </p>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 overflow-auto">

        {/* ===== Welcome ===== */}
        {loadingUser ? (
          <div className="mb-6 animate-pulse">
            <div className="h-8 w-64 bg-white/10 rounded mb-2" />
            <div className="h-4 w-96 bg-white/5 rounded" />
          </div>
        ) : (
          user && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                Welcome, <span className="text-indigo-400">{user.name}</span>
              </h1>
              <p className="text-sm text-white/60">
                Here’s your OpsMind AI activity overview
              </p>
            </div>
          )
        )}

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {loadingStats
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white/5 border border-white/10 rounded-xl animate-pulse"
                />
              ))
            : stats && (
                <>
                  <StatCard title="Documents" value={stats.documents} />
                  <StatCard title="Queries" value={stats.queries} />
                  <StatCard title="Accuracy" value={stats.accuracy} />
                </>
              )}
        </div>

        {/* ===== Chat + History ===== */}
        <div className="grid grid-cols-3 gap-6 h-[75%]">
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <ChatUI onNewChat={handleNewChat} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <History history={history} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===== STAT CARD ===== */
function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-sm text-white/60">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}
