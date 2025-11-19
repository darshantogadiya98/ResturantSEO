import React from 'react';
import {
  Plus,
  Square,
  Circle,
  Type,
  Image,
  Lightbulb,
  Brain,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Undo,
  Redo,
  FileText
} from 'lucide-react';

const CanvasToolbar = ({ onAddNode, onZoomIn, onZoomOut, onFitView, onExport, onShowFrameworks, onUndo, onRedo }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex items-center space-x-1">
        {/* Add Node Tools */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => onAddNode('text')}
            className="toolbar-button"
            title="Add Text Node"
          >
            <Type className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => onAddNode('note')}
            className="toolbar-button"
            title="Add Note"
          >
            <FileText className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => onAddNode('idea')}
            className="toolbar-button"
            title="Add Idea"
          >
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </button>
        </div>

        {/* Thinking Frameworks */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
          <button
            onClick={onShowFrameworks}
            className="toolbar-button"
            title="Thinking Frameworks"
          >
            <Brain className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
          <button
            onClick={onUndo}
            className="toolbar-button"
            title="Undo"
          >
            <Undo className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onRedo}
            className="toolbar-button"
            title="Redo"
          >
            <Redo className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
          <button
            onClick={onZoomIn}
            className="toolbar-button"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onZoomOut}
            className="toolbar-button"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onFitView}
            className="toolbar-button"
            title="Fit View"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Export */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onExport}
            className="toolbar-button"
            title="Export"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;
