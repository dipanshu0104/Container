import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center w-full"
      >
        {/* 🔥 SVG Gradient Stroke Text (NO GLOW) */}
        <svg viewBox="0 0 600 200" className="w-full max-w-4xl mx-auto">
          <defs>
            <linearGradient
              id="gradientStroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ff6ec7" />
              <stop offset="20%" stopColor="#ff9a44" />
              <stop offset="40%" stopColor="#ffd93d" />
              <stop offset="60%" stopColor="#6ef3a5" />
              <stop offset="80%" stopColor="#4dabf7" />
              <stop offset="100%" stopColor="#b06cff" />
            </linearGradient>
          </defs>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="120"
            fontWeight="900"
            fill="transparent"
            stroke="url(#gradientStroke)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            404
          </text>
        </svg>

        {/* Text Content */}
        <h2 className=" text-2xl sm:text-3xl font-semibold text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-black     
            bg-[linear-gradient(120deg,#ff4ecd,#ff8a3d,#ffe84a,#6dffb3,#42d4ff,#5b8cff,#b06cff)]
            bg-size-[100%_100%] hover:scale-105 transition-transform duration-300">
              <Home size={18} />
              Go Home
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white border border-gray-700 hover:bg-gray-900 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
