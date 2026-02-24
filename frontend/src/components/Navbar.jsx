import React from "react";
import { Code2, ArrowRight, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2e333b]/50 bg-[#15171e]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0088cc] rounded flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">HackDraft</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/search" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Search
              </Link>
              <Link to="/scout" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                AI Scout
              </Link>
              <div className="h-4 w-px bg-[#2e333b] mx-2" />
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
