import React from "react";
import { Copy, Terminal, ShieldCheck, Sparkles, Code2, Database, Layout, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import UserCard from "../components/UserCard";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#15171e] text-white selection:bg-[#0088cc] selection:text-white overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-600/30 text-xs font-medium text-purple-400 mb-8"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Partner Matching</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
        >
          Find Your Perfect <br />
          <span className="text-[#0088cc]">Hackathon Partner</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
        >
          Stop scrolling Discord. HackDraft analyzes GitHub repositories to match you with developers who verify their skills with code, not claims.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-8 py-3.5 rounded font-medium transition-all shadow-[0_0_20px_-5px_rgba(0,136,204,0.5)] hover:shadow-[0_0_25px_-5px_rgba(0,136,204,0.6)] flex items-center justify-center gap-2">
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
          <button className="bg-[#1d2127] hover:bg-[#252a31] border border-[#2e333b] text-white px-8 py-3.5 rounded font-medium transition-colors flex items-center justify-center gap-2">
            <Terminal className="w-5 h-5 text-zinc-400" />
            View Live Demo
          </button>
        </motion.div>

        {/* Mock User Cards Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          <UserCard 
            user={{
              _id: "demo1",
              name: "Alex Chen",
              role: "Full Stack Developer",
              trustScore: 980,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
              skills: [
                { name: "React", verified: true },
                { name: "Node.js", verified: true },
                { name: "TypeScript", verified: true }
              ]
            }}
            delay={0}
          />
          <UserCard 
            user={{
              _id: "demo2",
              name: "Sarah Jenkins",
              role: "Machine Learning Engineer",
              trustScore: 850,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              skills: [
                { name: "Python", verified: true },
                { name: "PyTorch", verified: true },
                { name: "Docker", verified: true }
              ]
            }}
            delay={0.2}
          />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-[#0088cc]" />}
            title="Verified Skills"
            description="We scan commit history to verify tech stacks. No more guessing if a 'React Expert' has actually pushed code."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Database className="w-6 h-6 text-[#0088cc]" />}
            title="Repo Analysis"
            description="Our engine reads project architecture, dependencies, and code patterns to understand developer seniority."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Layout className="w-6 h-6 text-[#0088cc]" />}
            title="Team Formation"
            description="Building a startup or hacking for a weekend? Find teammates whose coding style matches yours."
            delay={0.6}
          />
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="relative z-10 py-20 border-t border-[#2e333b]/50 bg-[#15171e]">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Code speaks louder than resumes.</h2>
                <p className="text-zinc-400 mb-6">
                  HackDraft uses advanced static analysis to connect you with builders who ship.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <StatBox value="10k+" label="Verified Devs" />
                  <StatBox value="50M+" label="Lines Analyzed" />
                  <StatBox value="98%" label="Match Rate" />
                  <StatBox value="24/7" label="Real-time Scans" />
                </div>
              </div>
              
              <div className="relative">
                {/* Abstract 'Terminal' or 'Card' UI representation */}
                <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-[#242830] px-4 py-3 border-b border-[#2e333b] flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="text-xs font-mono text-zinc-500">analysis.json</div>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="flex gap-2">
                       <span className="text-zinc-500">1</span>
                       <span className="text-purple-400">const</span> 
                       <span className="text-yellow-200">match</span> 
                       <span className="text-zinc-400">=</span> 
                       <span className="text-blue-400">await</span> 
                       <span className="text-green-300">HackDraft</span>
                       <span className="text-zinc-300">.</span>
                       <span className="text-yellow-200">findPartner</span>
                       <span className="text-zinc-300">({'{'}</span>
                    </div>
                    <div className="flex gap-2 pl-4">
                       <span className="text-zinc-500">2</span>
                       <span className="text-blue-300">skills</span>
                       <span className="text-zinc-300">:</span> 
                       <span className="text-orange-300">['React', 'Node.js']</span>
                       <span className="text-zinc-300">,</span>
                    </div>
                    <div className="flex gap-2 pl-4">
                       <span className="text-zinc-500">3</span>
                       <span className="text-blue-300">level</span>
                       <span className="text-zinc-300">:</span> 
                       <span className="text-green-300">'Senior'</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="text-zinc-500">4</span>
                       <span className="text-zinc-300">{'}'});</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                       <span className="text-zinc-500">5</span>
                       <span className="text-zinc-400">// Match found: 98% compatibility</span>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-[#2e333b] bg-[#1d2127]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <Code2 className="w-5 h-5 text-[#0088cc]" />
               <span className="font-bold text-zinc-300">HackDraft</span>
            </div>
            <div className="text-sm text-zinc-500">
               © 2026 HackDraft. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-[#1d2127] border border-[#2e333b] rounded-lg overflow-hidden hover:border-[#0088cc]/50 transition-colors"
    >
      <div className="h-1.5 w-full bg-[#2e333b] group-hover:bg-[#0088cc] transition-colors" />
      <div className="p-6">
        <div className="mb-4 bg-[#15171e] w-12 h-12 rounded-lg flex items-center justify-center border border-[#2e333b]">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

const StatBox = ({ value, label }) => (
  <div className="bg-[#1d2127] border border-[#2e333b] p-4 rounded-lg">
    <div className="text-2xl font-bold text-white font-[JetBrains_Mono]">{value}</div>
    <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{label}</div>
  </div>
);

export default LandingPage;
