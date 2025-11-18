import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const Roadmap = ({ topic, steps }) => {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Learning Roadmap: {topic}
        </h2>
        <p className="text-gray-600">
          Follow this curated path to master {topic}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-primary-200 -mb-4" />
            )}

            {/* Step Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative">
              <div className="flex items-start space-x-4">
                {/* Step Number/Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>

                  {/* Resources */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase">
                      Recommended Resources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <span>{resource.platform}</span>
                          <span className="text-gray-400">•</span>
                          <span className={resource.price === 'Free' ? 'text-green-600 font-semibold' : ''}>
                            {resource.price}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Skills Gained */}
                  {step.skills && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {step.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total Duration: <span className="font-semibold text-gray-900">
              {steps.reduce((acc, step) => {
                const hours = parseInt(step.duration);
                return acc + (isNaN(hours) ? 0 : hours);
              }, 0)} hours
            </span>
          </span>
          <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
