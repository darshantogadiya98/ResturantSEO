import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Lightbulb, FileText, Square, Trash2, Edit3 } from 'lucide-react';

// Text Node
export const TextNode = memo(({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'New Idea');

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(text);
    }
  };

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''}`} style={{ backgroundColor: data.color || 'white' }}>
      <Handle type="target" position={Position.Top} />

      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="input-field text-sm"
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="cursor-text font-medium text-gray-800"
        >
          {text}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

TextNode.displayName = 'TextNode';

// Idea Node (with lightbulb icon)
export const IdeaNode = memo(({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Brilliant Idea');

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''} bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start space-x-2">
        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="input-field text-sm"
            />
          ) : (
            <div
              onDoubleClick={() => setIsEditing(true)}
              className="cursor-text font-medium text-gray-800"
            >
              {text}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

IdeaNode.displayName = 'IdeaNode';

// Note Node
export const NoteNode = memo(({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Note');

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 min-w-[250px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start space-x-2">
        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="input-field text-sm resize-none"
              rows="3"
            />
          ) : (
            <div
              onDoubleClick={() => setIsEditing(true)}
              className="cursor-text font-medium text-gray-800 whitespace-pre-wrap text-sm"
            >
              {text}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

NoteNode.displayName = 'NoteNode';

// SWOT Framework Node
export const SWOTNode = memo(({ data, selected }) => {
  return (
    <div className={`framework-node-swot ${selected ? 'selected' : ''} p-4 rounded-xl shadow-lg border-2 min-w-[400px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <h3 className="font-bold text-lg text-blue-800">SWOT Analysis</h3>
        <p className="text-xs text-gray-600">{data.topic || 'Your Topic'}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-50 p-2 rounded border border-green-200">
          <p className="font-semibold text-xs text-green-800 mb-1">Strengths</p>
          <textarea className="input-field text-xs" rows="2" placeholder="Internal advantages..."></textarea>
        </div>
        <div className="bg-red-50 p-2 rounded border border-red-200">
          <p className="font-semibold text-xs text-red-800 mb-1">Weaknesses</p>
          <textarea className="input-field text-xs" rows="2" placeholder="Internal limitations..."></textarea>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-xs text-blue-800 mb-1">Opportunities</p>
          <textarea className="input-field text-xs" rows="2" placeholder="External factors..."></textarea>
        </div>
        <div className="bg-orange-50 p-2 rounded border border-orange-200">
          <p className="font-semibold text-xs text-orange-800 mb-1">Threats</p>
          <textarea className="input-field text-xs" rows="2" placeholder="External challenges..."></textarea>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

SWOTNode.displayName = 'SWOTNode';

// Six Thinking Hats Node
export const ThinkingHatsNode = memo(({ data, selected }) => {
  const hats = [
    { color: 'white', label: 'Facts', bg: 'bg-gray-50', border: 'border-gray-300' },
    { color: 'red', label: 'Emotions', bg: 'bg-red-50', border: 'border-red-300' },
    { color: 'yellow', label: 'Benefits', bg: 'bg-yellow-50', border: 'border-yellow-300' },
    { color: 'black', label: 'Cautions', bg: 'bg-gray-800 text-white', border: 'border-gray-800' },
    { color: 'green', label: 'Creativity', bg: 'bg-green-50', border: 'border-green-300' },
    { color: 'blue', label: 'Process', bg: 'bg-blue-50', border: 'border-blue-300' },
  ];

  return (
    <div className={`framework-node-hats ${selected ? 'selected' : ''} p-4 rounded-xl shadow-lg border-2 min-w-[350px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <h3 className="font-bold text-lg text-purple-800">Six Thinking Hats</h3>
        <p className="text-xs text-gray-600">{data.topic || 'Your Topic'}</p>
      </div>

      <div className="space-y-2">
        {hats.map((hat, index) => (
          <div key={index} className={`${hat.bg} p-2 rounded border ${hat.border}`}>
            <p className="font-semibold text-xs mb-1">{hat.label}</p>
            <input type="text" className="input-field text-xs" placeholder={`${hat.label} perspective...`} />
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ThinkingHatsNode.displayName = 'ThinkingHatsNode';

// Node type mapping
export const nodeTypes = {
  text: TextNode,
  idea: IdeaNode,
  note: NoteNode,
  swot: SWOTNode,
  thinkingHats: ThinkingHatsNode,
};
