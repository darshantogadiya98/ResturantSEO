import React from 'react';
import { Star, Clock, DollarSign, ExternalLink, Bookmark, TrendingUp } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  const {
    title,
    description,
    platform,
    type,
    difficulty,
    price,
    duration,
    rating,
    reviewCount,
    instructor,
    thumbnail,
    url,
    quality_score,
    tags
  } = resource;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  };

  const typeIcons = {
    video: '🎥',
    article: '📝',
    book: '📚',
    interactive: '💻',
    podcast: '🎙️',
    project: '🔨'
  };

  const platformColors = {
    youtube: 'bg-red-50 text-red-700',
    udemy: 'bg-purple-50 text-purple-700',
    coursera: 'bg-blue-50 text-blue-700',
    edx: 'bg-indigo-50 text-indigo-700',
    github: 'bg-gray-50 text-gray-700',
    medium: 'bg-green-50 text-green-700',
    freecodecamp: 'bg-emerald-50 text-emerald-700',
    pluralsight: 'bg-pink-50 text-pink-700'
  };

  return (
    <div className="card p-5 group hover:scale-[1.02] transition-all duration-200">
      {/* Header with Platform & Quality Score */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${platformColors[platform] || 'bg-gray-100 text-gray-700'}`}>
            {platform}
          </span>
          <span className="text-lg">{typeIcons[type]}</span>
        </div>
        <div className="flex items-center space-x-2">
          {quality_score && (
            <div className="flex items-center space-x-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">{quality_score}/10</span>
            </div>
          )}
          <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      {thumbnail && (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Instructor */}
      {instructor && (
        <p className="text-xs text-gray-500 mb-3">
          by <span className="font-medium text-gray-700">{instructor}</span>
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Rating */}
          {rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{duration}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-1">
          {price === 'Free' ? (
            <span className="text-sm font-bold text-green-600">Free</span>
          ) : (
            <>
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">{price}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Difficulty Badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-700'}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>

        {/* CTA Button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm group/link"
        >
          <span>View Resource</span>
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
