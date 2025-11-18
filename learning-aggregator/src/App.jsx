import { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ResourceCard from './components/ResourceCard';
import Roadmap from './components/Roadmap';
import { mockResources, mockRoadmaps } from './data/mockData';
import { MapIcon, Grid3X3, Sparkles } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    difficulty: [],
    price: [],
    platform: [],
    duration: []
  });
  const [viewMode, setViewMode] = useState('resources'); // 'resources' or 'roadmap'
  const [selectedRoadmap, setSelectedRoadmap] = useState('Web Development');

  // Filter resources based on search and filters
  const filteredResources = mockResources.filter(resource => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Type filter
    const matchesType = filters.type.length === 0 || filters.type.includes(resource.type);

    // Difficulty filter
    const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(resource.difficulty);

    // Price filter
    const matchesPrice = filters.price.length === 0 || (() => {
      if (filters.price.includes('free') && resource.price === 'Free') return true;
      if (filters.price.includes('paid') && resource.price !== 'Free') return true;
      return false;
    })();

    // Platform filter
    const matchesPlatform = filters.platform.length === 0 || filters.platform.includes(resource.platform);

    return matchesSearch && matchesType && matchesDifficulty && matchesPrice && matchesPlatform;
  });

  // Sort by quality score
  const sortedResources = [...filteredResources].sort((a, b) => b.quality_score - a.quality_score);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Auto-detect roadmap topics
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('machine learning') || lowerQuery.includes('ml') || lowerQuery.includes('ai')) {
      setSelectedRoadmap('Machine Learning');
    } else if (lowerQuery.includes('web') || lowerQuery.includes('frontend') || lowerQuery.includes('fullstack')) {
      setSelectedRoadmap('Web Development');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover the Best Learning Resources
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              AI-powered platform that aggregates learning resources from across the internet with quality scoring and personalized roadmaps
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('resources')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'resources'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">Resources</span>
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'roadmap'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="font-medium">Learning Roadmap</span>
            </button>
          </div>

          {/* Results Count */}
          {viewMode === 'resources' && (
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{sortedResources.length}</span> resources found
              {searchQuery && <span className="ml-2">for "{searchQuery}"</span>}
            </div>
          )}
        </div>

        {/* Resources View */}
        {viewMode === 'resources' && (
          <>
            <Filters onFilterChange={handleFilterChange} />

            {sortedResources.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search for something else
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      type: [],
                      difficulty: [],
                      price: [],
                      platform: [],
                      duration: []
                    });
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Roadmap View */}
        {viewMode === 'roadmap' && (
          <div>
            {/* Roadmap Selector */}
            <div className="mb-6 flex flex-wrap gap-3">
              {Object.keys(mockRoadmaps).map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedRoadmap(topic)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedRoadmap === topic
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-500'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Roadmap Component */}
            <Roadmap
              topic={selectedRoadmap}
              steps={mockRoadmaps[selectedRoadmap]}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <span className="font-semibold text-gray-900">LearnHub</span> - Your AI-powered learning resource aggregator
            </p>
            <p className="text-sm">
              Aggregating the best learning resources from YouTube, Udemy, Coursera, edX, freeCodeCamp, GitHub, and more
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
