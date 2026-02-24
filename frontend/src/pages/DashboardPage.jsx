import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { ShieldCheck, Search, Sparkles, Github, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user, checkAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("github_linked") && !hasRefreshed.current) {
      hasRefreshed.current = true;
      // Refresh user data once, then clean the URL
      checkAuth().then(() => {
        navigate("/dashboard", { replace: true });
      });
    }
  }, [location.search, checkAuth, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#15171e] text-white pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-zinc-400">Here's what's happening with your profile today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 flex items-center justify-center border border-[#0088cc]/30">
              <ShieldCheck className="w-6 h-6 text-[#0088cc]" />
            </div>
            <div>
              <div className="text-sm text-zinc-400 uppercase tracking-wider mb-1">Trust Score</div>
              <div className="text-2xl font-bold font-[JetBrains_Mono]">{user.trustScore || 0}</div>
            </div>
          </div>

          <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center border border-purple-600/30">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-zinc-400 uppercase tracking-wider mb-1">Verified Skills</div>
              <div className="text-2xl font-bold font-[JetBrains_Mono]">
                {user.skills?.filter(s => s.verified).length || 0}
              </div>
            </div>
          </div>

          <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-[#2e333b]">
              <Github className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <div className="text-sm text-zinc-400 uppercase tracking-wider mb-1">GitHub Status</div>
              <div className="text-sm font-medium mt-1">
                {user.githubId ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" /> Linked
                  </span>
                ) : (
                  <span className="text-yellow-400 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" /> Not Linked
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Standard Search */}
          <Link to="/search" className="group block">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 h-full transition-colors hover:border-[#0088cc]/50"
            >
              <div className="w-10 h-10 rounded bg-[#15171e] border border-[#2e333b] flex items-center justify-center mb-4 group-hover:bg-[#0088cc]/10 group-hover:border-[#0088cc]/30 transition-colors">
                <Search className="w-5 h-5 text-zinc-400 group-hover:text-[#0088cc] transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                Standard Search
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#0088cc] transition-colors" />
              </h3>
              <p className="text-zinc-400 text-sm">
                Find developers by specific skills, roles, or names using our advanced regex search.
              </p>
            </motion.div>
          </Link>

          {/* AI Scout */}
          <Link to="/scout" className="group block">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 h-full transition-colors hover:border-purple-500/50 relative overflow-hidden"
            >
              {/* Subtle purple glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-10 h-10 rounded bg-[#15171e] border border-[#2e333b] flex items-center justify-center mb-4 group-hover:bg-purple-600/10 group-hover:border-purple-600/30 transition-colors">
                <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                AI Scout
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              </h3>
              <p className="text-zinc-400 text-sm">
                Describe your ideal partner in plain English and let our AI find the perfect match.
              </p>
            </motion.div>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
