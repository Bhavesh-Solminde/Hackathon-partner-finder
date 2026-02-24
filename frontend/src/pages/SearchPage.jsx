import React, { useEffect, useState } from "react";
import { useMatchStore } from "../store/matchStore";
import UserCard from "../components/UserCard";
import Alert from "../components/Alert";
import { Search, Filter, Loader2 } from "lucide-react";

const SearchPage = () => {
  const { searchUsers, searchResults, isLoading, error } = useMatchStore();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  // Don't auto-search on mount — wait for user to submit

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    const filters = {};
    if (roleFilter) filters.role = roleFilter;
    if (skillFilter) filters.skills = skillFilter;

    searchUsers(query, filters);
  };

  return (
    <div className="min-h-screen bg-[#15171e] text-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Find Partners</h1>
          <p className="text-zinc-400">Search for developers by name, role, or specific skills.</p>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-[#1d2127] border border-[#2e333b] rounded-lg p-6 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or keyword..."
                className="w-full bg-[#15171e] border border-[#2e333b] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#0088cc] transition-colors"
              />
            </div>

            <div className="w-full md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-[#15171e] border border-[#2e333b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0088cc] transition-colors appearance-none"
              >
                <option value="">All Roles</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Designer">Designer</option>
              </select>
            </div>

            <div className="w-full md:w-48">
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder="Skill (e.g. React)"
                className="w-full bg-[#15171e] border border-[#2e333b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0088cc] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || (!query.trim() && !roleFilter && !skillFilter.trim())}
              className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {error && (
          <Alert type="error" className="mb-8">{error}</Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0088cc]" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#2e333b] rounded-lg">
            <Filter className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No developers found</h3>
            <p className="text-zinc-400">Try adjusting your search filters or keywords.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
