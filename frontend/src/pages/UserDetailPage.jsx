import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";
import { useMatchStore } from "../store/matchStore";
import { ShieldCheck, Github, MessageSquare, Loader2, ArrowLeft, Sparkles, Code2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { generateIcebreaker, icebreaker, isLoading: isIcebreakerLoading } = useMatchStore();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load user profile."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleGenerateIcebreaker = () => {
    generateIcebreaker(id);
  };

  const handleConnect = () => {
    if (user.githubHandle) {
      window.open(`https://github.com/${user.githubHandle}`, "_blank");
    } else if (user.email) {
      window.open(`mailto:${user.email}?subject=Let's team up on a hackathon!`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#15171e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0088cc]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#15171e] flex flex-col items-center justify-center text-white">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "User not found"}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-zinc-400 hover:text-white flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const verifiedSkills = user.skills?.filter(s => s.source === "GITHUB") || [];
  const manualSkills = user.skills?.filter(s => s.source === "MANUAL") || [];

  return (
    <div className="min-h-screen bg-[#15171e] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-[#1d2127] border border-[#2e333b] rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#0088cc]/20 to-purple-600/20 border-b border-[#2e333b]"></div>
              <div className="px-8 pb-8 relative">
                <div className="w-24 h-24 rounded-xl bg-[#15171e] border-4 border-[#1d2127] overflow-hidden -mt-12 mb-4 shadow-xl">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                    <p className="text-lg text-[#0088cc] font-medium mb-4">{user.role || "Developer"}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      {user.githubHandle && (
                        <a 
                          href={`https://github.com/${user.githubHandle}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          {user.githubHandle}
                        </a>
                      )}
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        Trust Score: {user.trustScore}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleConnect}
                    className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-[#1d2127] border border-[#2e333b] rounded-xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-[#2e333b] pb-4">
                <Code2 className="w-5 h-5 text-[#0088cc]" />
                Tech Stack
              </h2>
              
              {verifiedSkills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    Verified via GitHub
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {verifiedSkills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-[#15171e] border border-[#2e333b] rounded-md text-sm font-medium text-[#0088cc] font-[JetBrains_Mono] flex items-center gap-1.5"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {manualSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-zinc-500 mb-4 uppercase tracking-wider">
                    Self-Reported
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {manualSkills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-[#15171e] border border-[#2e333b] rounded-md text-sm text-zinc-400"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.skills?.length === 0 && (
                <p className="text-zinc-500 italic">No skills listed yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: AI Icebreaker */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-purple-900/20 to-[#1d2127] border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                AI Icebreaker
              </h2>
              
              <p className="text-sm text-zinc-400 mb-6">
                Not sure how to start the conversation? Let our AI analyze {user.name}'s GitHub profile and suggest a personalized opening message.
              </p>

              {!icebreaker ? (
                <button
                  onClick={handleGenerateIcebreaker}
                  disabled={isIcebreakerLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isIcebreakerLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Message
                    </>
                  )}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#15171e] border border-purple-500/30 rounded-lg p-4 relative group"
                >
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap font-[Inter] leading-relaxed">
                    {icebreaker}
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(icebreaker)}
                    className="absolute top-2 right-2 p-2 bg-[#1d2127] rounded border border-[#2e333b] text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
