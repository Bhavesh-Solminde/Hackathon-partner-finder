import React, { useState } from "react";
import { useMatchStore } from "../store/matchStore";
import UserCard from "../components/UserCard";
import Alert from "../components/Alert";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ScoutPage = () => {
  const { aiScout, scoutResults, isLoading, error } = useMatchStore();
  const [prompt, setPrompt] = useState("");

  const handleScout = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    aiScout(prompt);
  };

  return (
    <div className="min-h-screen bg-[#15171e] text-white pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Partner Scout
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Describe your ideal teammate.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Use natural language to find the perfect match for your hackathon project. 
            Our AI analyzes verified GitHub skills and project history to find the best fit.
          </p>
        </div>

        {/* AI Input Area */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleScout} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-[#0088cc] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#1d2127] border border-[#2e333b] rounded-xl p-2 flex items-center">
              <div className="pl-4 pr-2 text-purple-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'I need a frontend dev who knows React and Tailwind for a Web3 project'"
                className="w-full bg-transparent border-none text-white placeholder-zinc-500 px-4 py-4 focus:outline-none text-lg"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
              </button>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-zinc-500">Try:</span>
            {[
              "Python backend dev with FastAPI experience",
              "UI/UX designer who can code React",
              "Full stack dev for an AI wrapper app"
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-sm text-zinc-400 hover:text-purple-400 bg-[#1d2127] border border-[#2e333b] hover:border-purple-500/50 px-3 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {error && (
          <Alert type="error" className="mb-8 text-center max-w-2xl mx-auto">{error}</Alert>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="text-zinc-400 animate-pulse">Analyzing developer profiles...</p>
          </div>
        ) : scoutResults.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-[#2e333b] pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Top Matches
              </h2>
              <span className="text-sm text-zinc-400">{scoutResults.length} developers found</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scoutResults.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <UserCard user={user} />
                  {user.aiReasoning && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-purple-300 leading-relaxed">{user.aiReasoning}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

      </div>
    </div>
  );
};

export default ScoutPage;
