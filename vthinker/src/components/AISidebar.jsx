import React, { useState } from 'react';
import { Sparkles, Send, X, Lightbulb, Brain, ListTree, Target } from 'lucide-react';

const AISidebar = ({ isOpen, onClose, onAddAINode }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI thinking partner. I can help you brainstorm ideas, analyze problems, and structure your thoughts. Try asking me to help with SWOT analysis, mind mapping, or creative ideation!'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    { icon: Lightbulb, label: 'Generate Ideas', prompt: 'Help me brainstorm ideas about: ' },
    { icon: Brain, label: 'SWOT Analysis', prompt: 'Create a SWOT analysis for: ' },
    { icon: ListTree, label: 'Mind Map', prompt: 'Create a mind map about: ' },
    { icon: Target, label: 'Problem Solve', prompt: 'Help me solve this problem: ' },
  ];

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    // Add user message
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();

    if (lower.includes('swot')) {
      return "I'll help you create a SWOT analysis! Let's break this down:\n\n**Strengths:** What are the internal advantages?\n**Weaknesses:** What are the internal limitations?\n**Opportunities:** What external factors can you leverage?\n**Threats:** What external challenges might you face?\n\nWould you like me to add a SWOT framework to your canvas?";
    } else if (lower.includes('mind map')) {
      return "Great! Mind mapping is perfect for visual thinking. Let's structure your ideas:\n\n1. Start with your central topic\n2. Branch out to main themes\n3. Add sub-topics and details\n4. Connect related ideas\n\nShall I create a mind map template for you?";
    } else if (lower.includes('brainstorm') || lower.includes('ideas')) {
      return "Let's brainstorm! I can help you generate ideas using different techniques:\n\n- **Six Thinking Hats:** Look at it from different perspectives\n- **SCAMPER:** Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse\n- **First Principles:** Break down to fundamental truths\n\nWhich approach interests you?";
    } else if (lower.includes('problem')) {
      return "Let's tackle this problem systematically:\n\n1. **Define** the problem clearly\n2. **Analyze** root causes\n3. **Generate** potential solutions\n4. **Evaluate** pros and cons\n5. **Decide** on the best approach\n\nWhat problem are you trying to solve?";
    } else {
      return `I can help you with:\n\n- Generating and organizing ideas\n- Creating structured frameworks (SWOT, SCAMPER, etc.)\n- Mind mapping and visual thinking\n- Problem-solving and decision making\n- Critical and creative thinking\n\nWhat would you like to explore?`;
    }
  };

  const handleQuickAction = (prompt) => {
    setMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-panel fixed right-0 top-0 bottom-0 w-96 flex flex-col z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-3 font-medium uppercase">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex flex-col items-center space-y-2 p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors border border-gray-200 hover:border-primary-300"
            >
              <action.icon className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            className="input-field resize-none"
            rows="3"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="btn btn-primary p-3"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default AISidebar;
