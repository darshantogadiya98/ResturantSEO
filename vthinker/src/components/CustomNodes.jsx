import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Lightbulb, FileText, Square, Trash2, Edit3, Image as ImageIcon, Link2, CheckSquare, Zap, Target, Grid2X2 } from 'lucide-react';

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

// Image Node
export const ImageNode = memo(({ data, selected }) => {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''} bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 p-2`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-pink-600" />
          <span className="text-xs font-semibold text-pink-800">Image</span>
        </div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Node image"
            className="w-full h-32 object-cover rounded border border-pink-200"
          />
        ) : (
          <div className="w-full h-32 bg-pink-100 rounded border border-dashed border-pink-300 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-pink-400 mx-auto mb-1" />
              <p className="text-xs text-pink-600">Click to upload</p>
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Image URL or upload..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="input-field text-xs"
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ImageNode.displayName = 'ImageNode';

// Link/URL Node
export const LinkNode = memo(({ data, selected }) => {
  const [url, setUrl] = useState(data.url || '');
  const [title, setTitle] = useState(data.title || 'Link');

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''} bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start space-x-2">
        <Link2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link title"
            className="input-field text-sm font-medium"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="input-field text-xs text-cyan-700"
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-600 hover:underline flex items-center space-x-1"
            >
              <span>Open link</span>
              <Link2 className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

LinkNode.displayName = 'LinkNode';

// Task List Node
export const TaskNode = memo(({ data, selected }) => {
  const [tasks, setTasks] = useState(data.tasks || [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className={`mind-map-node ${selected ? 'selected' : ''} bg-gradient-to-br from-green-50 to-green-100 border-green-300 min-w-[220px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center space-x-2 mb-3">
        <CheckSquare className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-sm text-green-800">Task List</span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <label key={task.id} className="flex items-center space-x-2 cursor-pointer hover:bg-green-50 p-1 rounded">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-4 h-4 text-green-600 rounded"
            />
            <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.text}
            </span>
          </label>
        ))}
      </div>

      <button className="mt-2 text-xs text-green-600 hover:text-green-800 font-medium">
        + Add task
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';

// SCAMPER Framework Node
export const SCAMPERNode = memo(({ data, selected }) => {
  const categories = [
    { letter: 'S', name: 'Substitute', color: 'red' },
    { letter: 'C', name: 'Combine', color: 'orange' },
    { letter: 'A', name: 'Adapt', color: 'yellow' },
    { letter: 'M', name: 'Modify', color: 'green' },
    { letter: 'P', name: 'Put to other uses', color: 'blue' },
    { letter: 'E', name: 'Eliminate', color: 'indigo' },
    { letter: 'R', name: 'Reverse', color: 'purple' },
  ];

  return (
    <div className={`framework-node-scamper ${selected ? 'selected' : ''} p-4 rounded-xl shadow-lg border-2 min-w-[400px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="mb-3 flex items-center space-x-2">
        <Zap className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="font-bold text-lg text-green-800">SCAMPER</h3>
          <p className="text-xs text-gray-600">{data.topic || 'Creative Problem Solving'}</p>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((cat, index) => (
          <div key={index} className={`bg-${cat.color}-50 p-2 rounded border border-${cat.color}-200`}>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-bold text-${cat.color}-700 text-sm w-6`}>{cat.letter}</span>
              <span className="font-semibold text-xs text-gray-700">{cat.name}</span>
            </div>
            <input type="text" className="input-field text-xs" placeholder={`Ideas for ${cat.name}...`} />
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

SCAMPERNode.displayName = 'SCAMPERNode';

// First Principles Node
export const FirstPrinciplesNode = memo(({ data, selected }) => {
  return (
    <div className={`framework-node ${selected ? 'selected' : ''} p-4 rounded-xl shadow-lg border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100 min-w-[400px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="mb-3 flex items-center space-x-2">
        <Target className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-bold text-lg text-red-800">First Principles Thinking</h3>
          <p className="text-xs text-gray-600">{data.topic || 'Break it down'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded border border-red-200">
          <p className="font-semibold text-xs text-red-800 mb-2">1. Identify assumptions</p>
          <textarea className="input-field text-xs" rows="2" placeholder="What do we assume to be true?"></textarea>
        </div>

        <div className="bg-white p-3 rounded border border-red-200">
          <p className="font-semibold text-xs text-red-800 mb-2">2. Break down to fundamentals</p>
          <textarea className="input-field text-xs" rows="2" placeholder="What are the fundamental truths?"></textarea>
        </div>

        <div className="bg-white p-3 rounded border border-red-200">
          <p className="font-semibold text-xs text-red-800 mb-2">3. Rebuild from the ground up</p>
          <textarea className="input-field text-xs" rows="2" placeholder="How can we reconstruct this?"></textarea>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

FirstPrinciplesNode.displayName = 'FirstPrinciplesNode';

// Business Model Canvas Node
export const BusinessModelCanvasNode = memo(({ data, selected }) => {
  const sections = [
    { name: 'Key Partners', color: 'purple' },
    { name: 'Key Activities', color: 'blue' },
    { name: 'Value Propositions', color: 'red' },
    { name: 'Customer Relationships', color: 'orange' },
    { name: 'Customer Segments', color: 'pink' },
    { name: 'Key Resources', color: 'indigo' },
    { name: 'Channels', color: 'green' },
    { name: 'Cost Structure', color: 'yellow' },
    { name: 'Revenue Streams', color: 'teal' },
  ];

  return (
    <div className={`framework-node ${selected ? 'selected' : ''} p-4 rounded-xl shadow-lg border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100 min-w-[500px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="mb-3 flex items-center space-x-2">
        <Grid2X2 className="w-6 h-6 text-indigo-600" />
        <div>
          <h3 className="font-bold text-lg text-indigo-800">Business Model Canvas</h3>
          <p className="text-xs text-gray-600">{data.businessName || 'Your Business'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sections.map((section, index) => (
          <div key={index} className={`bg-${section.color}-50 p-2 rounded border border-${section.color}-200`}>
            <p className="font-semibold text-xs mb-1">{section.name}</p>
            <textarea className="input-field text-xs" rows="2" placeholder={`${section.name}...`}></textarea>
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

BusinessModelCanvasNode.displayName = 'BusinessModelCanvasNode';

// Node type mapping
export const nodeTypes = {
  text: TextNode,
  idea: IdeaNode,
  note: NoteNode,
  image: ImageNode,
  link: LinkNode,
  task: TaskNode,
  swot: SWOTNode,
  thinkingHats: ThinkingHatsNode,
  scamper: SCAMPERNode,
  firstPrinciples: FirstPrinciplesNode,
  businessModel: BusinessModelCanvasNode,
};
