import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../lib/axios";
import { ShieldCheck, Github, Save, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Alert from "../components/Alert";

const CANONICAL_ROLES = ["Frontend", "Backend", "Full Stack", "Designer"];

const ProfilePage = () => {
  const { user, checkAuth } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  // Normalize stored role to a canonical value if possible, else blank
  const [role, setRole] = useState(() => {
    const stored = user?.role || "";
    return CANONICAL_ROLES.find((r) => stored.toLowerCase().includes(r.toLowerCase())) || "";
  });
  const [manualSkills, setManualSkills] = useState(
    user?.skills?.filter(s => s.source === "MANUAL").map(s => s.name).join(", ") || ""
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const skillsArray = manualSkills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(name => ({ name, type: "TOOL" }));

      await axiosInstance.put("/users/profile", {
        name,
        role,
        skills: skillsArray
      });

      await checkAuth(); // Refresh user data
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncGithub = async () => {
    setIsSyncing(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axiosInstance.post("/users/sync");
      await checkAuth(); // Refresh user data
      setMessage({ type: "success", text: response.data.message || "GitHub sync complete." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to sync GitHub." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLinkGithub = () => {
    window.location.href = "http://localhost:8080/api/v1/auth/github";
  };

  if (!user) return null;

  const githubSkills = user.skills?.filter(s => s.source === "GITHUB") || [];

  return (
    <div className="min-h-screen bg-[#15171e] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert type={message.type} className="mb-8">{message.text}</Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Edit Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 border-b border-[#2e333b] pb-4">Basic Information</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#15171e] border border-[#2e333b] rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#0088cc] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#15171e] border border-[#2e333b] rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#0088cc] transition-colors appearance-none"
                  >
                    <option value="">Select your role...</option>
                    <option value="Frontend">Frontend Developer</option>
                    <option value="Backend">Backend Developer</option>
                    <option value="Full Stack">Full Stack Developer</option>
                    <option value="Designer">Designer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Manual Skills (Comma separated)</label>
                  <textarea
                    value={manualSkills}
                    onChange={(e) => setManualSkills(e.target.value)}
                    className="w-full bg-[#15171e] border border-[#2e333b] rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#0088cc] transition-colors min-h-[100px]"
                    placeholder="React, Node.js, Figma..."
                  />
                  <p className="text-xs text-zinc-500 mt-2">These skills will not be marked as verified.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-6 py-2.5 rounded font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: GitHub Integration */}
          <div className="space-y-6">
            <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 border-b border-[#2e333b] pb-4 flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Integration
              </h2>

              {!user.githubId ? (
                <div className="text-center py-4">
                  <p className="text-sm text-zinc-400 mb-6">
                    Link your GitHub account to verify your skills and increase your Trust Score.
                  </p>
                  <button
                    onClick={handleLinkGithub}
                    className="w-full bg-[#15171e] hover:bg-[#2e333b] border border-[#2e333b] text-white py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    Link GitHub Account
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6 bg-[#15171e] p-3 rounded border border-[#2e333b]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1d2127] overflow-hidden">
                        <img src={user.avatar} alt="GitHub Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.githubHandle || "Linked"}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Connected
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSyncGithub}
                    disabled={isSyncing}
                    className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mb-6"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing Repos..." : "Sync GitHub Stats"}
                  </button>

                  {user.lastSynced && (
                    <p className="text-xs text-zinc-500 text-center mb-6">
                      Last synced: {new Date(user.lastSynced).toLocaleString()}
                    </p>
                  )}

                  {/* Verified Skills List */}
                  {githubSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">Verified Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {githubSkills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-[#15171e] border border-[#2e333b] rounded text-xs font-medium text-[#0088cc] font-[JetBrains_Mono] flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
