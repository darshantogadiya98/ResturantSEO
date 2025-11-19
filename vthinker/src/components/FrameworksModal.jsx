import React from 'react';
import { X, Brain, Target, Lightbulb, Grid3x3, ListTree, Zap } from 'lucide-react';

const FrameworksModal = ({ isOpen, onClose, onSelectFramework }) => {
  const frameworks = [
    {
      id: 'swot',
      name: 'SWOT Analysis',
      description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats',
      icon: Grid3x3,
      color: 'blue',
    },
    {
      id: 'thinkingHats',
      name: 'Six Thinking Hats',
      description: 'Explore different perspectives: facts, emotions, benefits, cautions, creativity, process',
      icon: Brain,
      color: 'purple',
    },
    {
      id: 'scamper',
      name: 'SCAMPER',
      description: 'Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse',
      icon: Zap,
      color: 'green',
    },
    {
      id: 'firstPrinciples',
      name: 'First Principles',
      description: 'Break down complex problems to fundamental truths and rebuild from there',
      icon: Target,
      color: 'red',
    },
    {
      id: 'mindMap',
      name: 'Mind Map',
      description: 'Visual diagram for organizing information around a central concept',
      icon: ListTree,
      color: 'indigo',
    },
    {
      id: 'brainstorm',
      name: 'Free Brainstorm',
      description: 'Open-ended creative ideation without constraints',
      icon: Lightbulb,
      color: 'yellow',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Thinking Frameworks</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a framework to structure your thinking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Frameworks Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => {
                onSelectFramework(framework.id);
                onClose();
              }}
              className={`text-left p-4 rounded-xl border-2 border-${framework.color}-200 bg-${framework.color}-50 hover:bg-${framework.color}-100 hover:border-${framework.color}-300 transition-all duration-200 group`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 bg-${framework.color}-200 rounded-lg group-hover:scale-110 transition-transform`}>
                  <framework.icon className={`w-6 h-6 text-${framework.color}-700`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{framework.name}</h3>
                  <p className="text-sm text-gray-600">{framework.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              💡 Tip: You can add multiple frameworks to the same canvas
            </p>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworksModal;
