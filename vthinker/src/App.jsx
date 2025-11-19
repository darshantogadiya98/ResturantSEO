import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CanvasToolbar from './components/CanvasToolbar';
import AISidebar from './components/AISidebar';
import FrameworksModal from './components/FrameworksModal';
import { nodeTypes } from './components/CustomNodes';
import { Sparkles, Menu, Download } from 'lucide-react';

const initialNodes = [
  {
    id: '1',
    type: 'text',
    position: { x: 250, y: 100 },
    data: { label: 'Welcome to VThinker!', color: '#e0f2fe' },
  },
  {
    id: '2',
    type: 'idea',
    position: { x: 100, y: 250 },
    data: { label: 'AI-Powered Mind Mapping' },
  },
  {
    id: '3',
    type: 'note',
    position: { x: 400, y: 250 },
    data: { label: 'Double-click any node to edit.\nDrag to create connections.\nUse the toolbar to add new nodes.' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

let nodeId = 4;

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showAI, setShowAI] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onInit = (rfi) => setReactFlowInstance(rfi);

  // Add new node
  const addNode = useCallback((type) => {
    const position = reactFlowInstance
      ? reactFlowInstance.project({ x: 400, y: 300 })
      : { x: Math.random() * 400, y: Math.random() * 400 };

    const labels = {
      text: 'New Idea',
      idea: 'Brilliant Thought',
      note: 'Note your thoughts here...',
    };

    const newNode = {
      id: `${nodeId++}`,
      type,
      position,
      data: { label: labels[type] || 'New Node' },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, setNodes]);

  // Add framework node
  const addFrameworkNode = useCallback((frameworkType) => {
    const position = reactFlowInstance
      ? reactFlowInstance.project({ x: 300, y: 200 })
      : { x: 300, y: 200 };

    const newNode = {
      id: `${nodeId++}`,
      type: frameworkType,
      position,
      data: { topic: 'Your Topic' },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, setNodes]);

  // Zoom controls
  const onZoomIn = () => reactFlowInstance?.zoomIn();
  const onZoomOut = () => reactFlowInstance?.zoomOut();
  const onFitView = () => reactFlowInstance?.fitView();

  // Export functions
  const exportToJSON = () => {
    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vthinker-mindmap.json';
    link.click();
    setShowExportMenu(false);
  };

  const exportToPNG = async () => {
    if (!reactFlowInstance) return;

    const { getNodes } = reactFlowInstance;
    const nodesBounds = getNodes().reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + 200),
        maxY: Math.max(acc.maxY, node.position.y + 200),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const width = nodesBounds.maxX - nodesBounds.minX;
    const height = nodesBounds.maxY - nodesBounds.minY;

    // This is a simplified version - in production you'd use html2canvas or similar
    alert('PNG export would be implemented with html2canvas library');
    setShowExportMenu(false);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 flex items-center justify-between shadow-lg z-30">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">VThinker</h1>
            <p className="text-xs text-primary-100">AI-Powered Visual Thinking Workspace</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              showAI
                ? 'bg-white text-primary-700'
                : 'bg-primary-500 hover:bg-primary-400 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-400 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={exportToJSON}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Export as JSON
                </button>
                <button
                  onClick={exportToPNG}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Export as PNG
                </button>
                <button
                  onClick={() => alert('PDF export coming soon!')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="canvas-grid"
        >
          <Background color="#e9ecef" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'idea':
                  return '#fef3c7';
                case 'note':
                  return '#dbeafe';
                case 'swot':
                  return '#bfdbfe';
                case 'thinkingHats':
                  return '#e9d5ff';
                default:
                  return '#f3f4f6';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.05)"
          />

          {/* Toolbar */}
          <Panel position="top-center">
            <CanvasToolbar
              onAddNode={addNode}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onFitView={onFitView}
              onExport={() => setShowExportMenu(!showExportMenu)}
              onShowFrameworks={() => setShowFrameworks(true)}
              onUndo={() => console.log('Undo')}
              onRedo={() => console.log('Redo')}
            />
          </Panel>

          {/* Welcome Panel */}
          <Panel position="bottom-right" className="bg-white rounded-lg shadow-lg p-4 mr-4 mb-4 max-w-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">🎯 Quick Start</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Drag nodes to move them around</li>
              <li>• Double-click nodes to edit text</li>
              <li>• Drag from node edges to create connections</li>
              <li>• Click <Sparkles className="w-3 h-3 inline" /> to get AI assistance</li>
              <li>• Use toolbar to add nodes & frameworks</li>
            </ul>
          </Panel>
        </ReactFlow>

        {/* AI Sidebar */}
        <AISidebar
          isOpen={showAI}
          onClose={() => setShowAI(false)}
          onAddAINode={(content) => {
            addNode('text');
          }}
        />

        {/* Frameworks Modal */}
        <FrameworksModal
          isOpen={showFrameworks}
          onClose={() => setShowFrameworks(false)}
          onSelectFramework={addFrameworkNode}
        />
      </div>
    </div>
  );
}

export default App;
