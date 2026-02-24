import React from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserCard = ({ user, delay = 0 }) => {
  const { _id, name, role, trustScore, avatar, skills } = user;

  // Truncate skills to max 5 for the card
  const displaySkills = skills?.slice(0, 5) || [];
  const extraSkillsCount = (skills?.length || 0) - displaySkills.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#1d2127] border border-[#2e333b] rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-lg flex flex-col h-full"
    >
      {/* Header Strip (24px colored top) */}
      <div className="h-6 bg-[#2e333b] w-full" />
      
      <div className="px-6 py-6 relative flex-grow flex flex-col">
        {/* Overlapping Avatar (-mt-10) */}
        <div className="flex justify-between items-start -mt-10 mb-2">
          <div className="w-20 h-20 rounded-full border-4 border-[#1d2127] bg-[#15171e] overflow-hidden">
            <img 
              src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Trust Score Badge */}
          <div className="mt-12 flex items-center gap-1.5 bg-[#15171e] border border-[#2e333b] px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#0088cc]" />
            <span className="text-sm font-bold text-white font-[JetBrains_Mono]">{trustScore || 0}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-zinc-400 text-sm">{role || "Developer"}</p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
          {displaySkills.map((skill, idx) => (
            <span 
              key={idx} 
              className={`px-2.5 py-1 bg-[#15171e] border border-[#2e333b] rounded text-xs font-medium font-[JetBrains_Mono] flex items-center gap-1.5 ${
                skill.verified ? "text-[#0088cc]" : "text-zinc-300"
              }`}
            >
              {skill.verified ? (
                <ShieldCheck className="w-3 h-3" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              )}
              {skill.name}
            </span>
          ))}
          {extraSkillsCount > 0 && (
            <span className="px-2.5 py-1 bg-[#15171e] border border-[#2e333b] rounded text-xs font-medium text-zinc-500 font-[JetBrains_Mono] flex items-center">
              +{extraSkillsCount}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Link 
          to={`/user/${_id}`}
          className="w-full py-2 bg-[#15171e] hover:bg-[#2e333b] border border-[#2e333b] rounded text-sm font-medium text-center transition-colors mt-auto"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default UserCard;
