import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LearnHub</h1>
              <p className="text-xs text-gray-500">Discover. Learn. Grow.</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Explore
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Roadmaps
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Saved
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-2 btn-primary">
              <Sparkles className="w-4 h-4" />
              <span>AI Roadmap</span>
            </button>
            <button className="md:hidden p-2 text-gray-600 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
