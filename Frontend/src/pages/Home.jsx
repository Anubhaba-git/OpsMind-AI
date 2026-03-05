import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const STAR_COUNT = 600;
    const stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        const dx = s.x - mouse.current.x;
        const dy = s.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          s.vx += dx / dist;
          s.vy += dy / dist;
        }

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#93c5fd";
        ctx.fill();
      });

      // draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = "rgba(147,197,253,0.12)";
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Title */}
        <h1 className="text-7xl md:text-8xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]">
          OpsMind AI
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-xl md:text-2xl opacity-80 tracking-wider">
          Enterprise SOP Intelligence System
        </p>

        {/* Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:scale-110 hover:shadow-indigo-500/40 transition duration-300"
          >
            Login 
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 border border-white/60 rounded-xl font-semibold hover:bg-white/10 hover:scale-110 transition duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
