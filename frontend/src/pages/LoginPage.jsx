import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import OAuthButton from "../components/OAuthButton";
import Alert from "../components/Alert";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/github";
  };

  return (
    <div className="min-h-screen bg-[#15171e] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg shadow-2xl overflow-hidden">
          {/* Header Strip */}
          <div className="h-2 bg-[#0088cc] w-full" />
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-zinc-400 text-sm">Sign in to find your next hackathon partner.</p>
            </div>

            {error && (
              <Alert type="error" className="mb-6">{error}</Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#15171e] border border-[#2e333b] rounded pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#0088cc] transition-colors"
                    placeholder="developer@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#15171e] border border-[#2e333b] rounded pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-[#0088cc] transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px bg-[#2e333b] flex-1" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-[#2e333b] flex-1" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <OAuthButton provider="Google" onClick={handleGoogleLogin} />
              <OAuthButton provider="GitHub" onClick={handleGithubLogin} />
            </div>
          </div>
          
          <div className="bg-[#15171e] border-t border-[#2e333b] p-4 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0088cc] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
