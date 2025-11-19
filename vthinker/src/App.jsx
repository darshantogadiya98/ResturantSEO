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
  getRectOfNodes,
  getTransformForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

import CanvasToolbar from './components/CanvasToolbar';
import AISidebar from './components/AISidebar';
import FrameworksModal from './components/FrameworksModal';
import ImportModal from './components/ImportModal';
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
  const [showImport, setShowImport] = useState(false);
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
      image: 'Image',
      link: 'Link',
      task: 'Tasks',
    };

    const newNode = {
      id: `${nodeId++}`,
      type,
      position,
      data: { label: labels[type] || 'New Node' },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, setNodes]);

  // Handle import from URL/YouTube
  const handleImport = useCallback((mindMapData) => {
    // In production, this would process the AI-generated mind map
    // For now, just add a sample node
    const position = reactFlowInstance
      ? reactFlowInstance.project({ x: 300, y: 200 })
      : { x: 300, y: 200 };

    const newNode = {
      id: `${nodeId++}`,
      type: 'text',
      position,
      data: { label: mindMapData.topic },
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

    try {
      const viewport = document.querySelector('.react-flow__viewport');
      if (!viewport) {
        alert('Canvas not found');
        return;
      }

      // Hide controls and minimap for cleaner export
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panels = document.querySelectorAll('.react-flow__panel');

      const elementsToHide = [controls, minimap, ...panels].filter(Boolean);
      elementsToHide.forEach(el => el.style.display = 'none');

      // Capture canvas with html2canvas
      const canvas = await html2canvas(viewport, {
        backgroundColor: '#f8f9fa',
        scale: 2, // Higher resolution
        logging: false,
      });

      // Show hidden elements again
      elementsToHide.forEach(el => el.style.display = '');

      // Convert to PNG and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `vthinker-mindmap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setShowExportMenu(false);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Failed to export PNG. Please try again.');
    }
  };

  const exportToPDF = async () => {
    if (!reactFlowInstance) return;

    try {
      const viewport = document.querySelector('.react-flow__viewport');
      if (!viewport) {
        alert('Canvas not found');
        return;
      }

      // Hide controls and minimap for cleaner export
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panels = document.querySelectorAll('.react-flow__panel');

      const elementsToHide = [controls, minimap, ...panels].filter(Boolean);
      elementsToHide.forEach(el => el.style.display = 'none');

      // Capture canvas with html2canvas
      const canvas = await html2canvas(viewport, {
        backgroundColor: '#f8f9fa',
        scale: 2,
        logging: false,
      });

      // Show hidden elements again
      elementsToHide.forEach(el => el.style.display = '');

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Create PDF with jsPDF
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`vthinker-mindmap-${Date.now()}.pdf`);

      setShowExportMenu(false);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const exportToSlides = async () => {
    if (!reactFlowInstance) return;

    try {
      // Create PowerPoint presentation
      const pptx = new pptxgen();

      // Title slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: '0284c7' };
      titleSlide.addText('VThinker Mind Map', {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1.5,
        fontSize: 44,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
      });
      titleSlide.addText('Visual Thinking Workspace', {
        x: 0.5,
        y: 3,
        w: 9,
        h: 0.5,
        fontSize: 24,
        color: 'e0f2fe',
        align: 'center',
      });

      // Capture the canvas as image
      const viewport = document.querySelector('.react-flow__viewport');
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panels = document.querySelectorAll('.react-flow__panel');

      const elementsToHide = [controls, minimap, ...panels].filter(Boolean);
      elementsToHide.forEach(el => el.style.display = 'none');

      const canvas = await html2canvas(viewport, {
        backgroundColor: '#f8f9fa',
        scale: 1.5,
        logging: false,
      });

      elementsToHide.forEach(el => el.style.display = '');

      const imgData = canvas.toDataURL('image/png');

      // Main mind map slide
      const mainSlide = pptx.addSlide();
      mainSlide.background = { color: 'f8f9fa' };
      mainSlide.addText('Mind Map Overview', {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '1e293b',
      });
      mainSlide.addImage({
        data: imgData,
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 5,
      });

      // Node details slides - one slide per major node
      const majorNodes = nodes.filter(node =>
        ['swot', 'thinkingHats', 'scamper', 'firstPrinciples', 'businessModel'].includes(node.type)
      );

      majorNodes.forEach((node, index) => {
        const nodeSlide = pptx.addSlide();
        nodeSlide.background = { color: 'FFFFFF' };

        const titles = {
          swot: 'SWOT Analysis',
          thinkingHats: 'Six Thinking Hats',
          scamper: 'SCAMPER Framework',
          firstPrinciples: 'First Principles Thinking',
          businessModel: 'Business Model Canvas',
        };

        nodeSlide.addText(titles[node.type] || 'Framework', {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 0.8,
          fontSize: 36,
          bold: true,
          color: '0284c7',
        });

        nodeSlide.addText(node.data.topic || 'Your Topic', {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 0.5,
          fontSize: 24,
          color: '475569',
        });

        nodeSlide.addText('Framework applied to analyze and structure thinking', {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 3,
          fontSize: 18,
          color: '64748b',
          valign: 'top',
        });
      });

      // Summary slide
      const summarySlide = pptx.addSlide();
      summarySlide.background = { color: '0ea5e9' };
      summarySlide.addText('Key Takeaways', {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1,
        fontSize: 40,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
      });
      summarySlide.addText(`Total Nodes: ${nodes.length}`, {
        x: 0.5,
        y: 3,
        w: 9,
        h: 0.5,
        fontSize: 24,
        color: 'e0f2fe',
        align: 'center',
      });
      summarySlide.addText(`Connections: ${edges.length}`, {
        x: 0.5,
        y: 3.7,
        w: 9,
        h: 0.5,
        fontSize: 24,
        color: 'e0f2fe',
        align: 'center',
      });

      // Save presentation
      await pptx.writeFile({ fileName: `vthinker-presentation-${Date.now()}.pptx` });
      setShowExportMenu(false);
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      alert('Failed to export to PowerPoint. Please try again.');
    }
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={exportToJSON}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  📄 Export as JSON
                </button>
                <button
                  onClick={exportToPNG}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  🖼️ Export as PNG Image
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                >
                  📕 Export as PDF
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={exportToSlides}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  🎯 Export as Presentation
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
              onShowImport={() => setShowImport(true)}
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

        {/* Import Modal */}
        <ImportModal
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}

export default App;
