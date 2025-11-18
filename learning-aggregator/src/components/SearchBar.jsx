import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = [
    'Machine Learning for beginners',
    'Full Stack Web Development',
    'Python Data Science',
    'React & Next.js',
    'DevOps & AWS',
    'UI/UX Design'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative flex items-center transition-all duration-200 ${
          isFocused ? 'scale-105' : ''
        }`}>
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="What do you want to learn? (e.g., Python, Web Development, AI...)"
            className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all duration-200 shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-2 flex items-center space-x-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Search Suggestions */}
        {isFocused && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-10">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Popular Searches</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    onSearch(search);
                  }}
                  className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-150"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick Filters */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {['Free Only', 'Beginner Friendly', 'Project-Based', 'Certificate Available'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 text-sm bg-white text-gray-600 rounded-full border border-gray-200 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
