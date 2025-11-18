import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const Filters = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    difficulty: [],
    price: [],
    platform: [],
    duration: []
  });

  const filterOptions = {
    type: [
      { id: 'video', label: 'Video Courses', icon: '🎥' },
      { id: 'article', label: 'Articles & Blogs', icon: '📝' },
      { id: 'book', label: 'Books & eBooks', icon: '📚' },
      { id: 'interactive', label: 'Interactive', icon: '💻' },
      { id: 'podcast', label: 'Podcasts', icon: '🎙️' },
      { id: 'project', label: 'Projects', icon: '🔨' }
    ],
    difficulty: [
      { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
      { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' }
    ],
    price: [
      { id: 'free', label: 'Free', icon: '💚' },
      { id: 'paid', label: 'Paid', icon: '💰' },
      { id: 'freemium', label: 'Freemium', icon: '🔓' }
    ],
    platform: [
      { id: 'youtube', label: 'YouTube' },
      { id: 'udemy', label: 'Udemy' },
      { id: 'coursera', label: 'Coursera' },
      { id: 'edx', label: 'edX' },
      { id: 'github', label: 'GitHub' },
      { id: 'medium', label: 'Medium' },
      { id: 'freecodecamp', label: 'freeCodeCamp' },
      { id: 'pluralsight', label: 'Pluralsight' }
    ],
    duration: [
      { id: 'short', label: '< 5 hours' },
      { id: 'medium', label: '5-20 hours' },
      { id: 'long', label: '20-50 hours' },
      { id: 'extensive', label: '50+ hours' }
    ]
  };

  const toggleFilter = (category, filterId) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[category];
      const newFilters = categoryFilters.includes(filterId)
        ? categoryFilters.filter(id => id !== filterId)
        : [...categoryFilters, filterId];

      const updated = { ...prev, [category]: newFilters };
      onFilterChange(updated);
      return updated;
    });
  };

  const clearFilters = () => {
    const cleared = {
      type: [],
      difficulty: [],
      price: [],
      platform: [],
      duration: []
    };
    setSelectedFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 font-medium hover:text-primary-600 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-gray-100">
          {/* Resource Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resource Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {filterOptions.type.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('type', option.id)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    selectedFilters.type.includes(option.id)
                      ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.difficulty.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('difficulty', option.id)}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                    selectedFilters.difficulty.includes(option.id)
                      ? option.color + ' ring-2 ring-offset-2 ring-primary-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Price</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.price.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('price', option.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    selectedFilters.price.includes(option.id)
                      ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {filterOptions.platform.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('platform', option.id)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    selectedFilters.platform.includes(option.id)
                      ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Duration</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.duration.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter('duration', option.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    selectedFilters.duration.includes(option.id)
                      ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
