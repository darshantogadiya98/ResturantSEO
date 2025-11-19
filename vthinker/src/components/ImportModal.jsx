import React, { useState } from 'react';
import { X, Youtube, Link2, FileText, Sparkles, Loader2 } from 'lucide-react';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'url', label: 'Web Page', icon: Link2 },
    { id: 'text', label: 'Text', icon: FileText },
  ];

  const handleImport = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockMindMap = generateMockMindMap(activeTab, inputValue);
      onImport(mockMindMap);
      setIsLoading(false);
      setInputValue('');
      onClose();
    }, 2000);
  };

  const generateMockMindMap = (type, input) => {
    // In production, this would call real API to extract content
    const baseTopic = type === 'youtube' ? 'Video Summary' :
                     type === 'url' ? 'Web Page Content' :
                     'Text Analysis';

    return {
      topic: baseTopic,
      nodes: [
        { label: 'Main Topic', type: 'text' },
        { label: 'Key Point 1', type: 'idea' },
        { label: 'Key Point 2', type: 'idea' },
        { label: 'Details', type: 'note' },
      ]
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Import & Generate Mind Map</h2>
            <p className="text-sm text-gray-600 mt-1">AI will analyze and create a structured mind map</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'youtube' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-2">
                📺 AI will extract the video transcript and create a structured mind map
              </p>
            </div>
          )}

          {activeTab === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Web Page URL
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://example.com/article"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-2">
                🌐 AI will extract main topics and key points from the web page
              </p>
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Text Content
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste your article, notes, or any text content here..."
                className="input-field resize-none"
                rows="8"
              />
              <p className="text-xs text-gray-500 mt-2">
                📝 AI will analyze and structure your text into a mind map
              </p>
            </div>
          )}

          {/* Examples */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">💡 Examples:</p>
            <div className="space-y-1">
              {activeTab === 'youtube' && (
                <>
                  <button
                    onClick={() => setInputValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                    className="text-xs text-primary-600 hover:underline block"
                  >
                    Educational video example
                  </button>
                  <button
                    onClick={() => setInputValue('https://www.youtube.com/watch?v=example123')}
                    className="text-xs text-primary-600 hover:underline block"
                  >
                    Tutorial video example
                  </button>
                </>
              )}
              {activeTab === 'url' && (
                <>
                  <button
                    onClick={() => setInputValue('https://en.wikipedia.org/wiki/Artificial_intelligence')}
                    className="text-xs text-primary-600 hover:underline block"
                  >
                    Wikipedia article
                  </button>
                  <button
                    onClick={() => setInputValue('https://blog.example.com/article')}
                    className="text-xs text-primary-600 hover:underline block"
                  >
                    Blog post
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            ⚡ Powered by AI - Results may vary
          </p>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!inputValue.trim() || isLoading}
              className="btn btn-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Mind Map</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
