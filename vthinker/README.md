# 🧠 VThinker - AI-Powered Visual Thinking Workspace

**Transform your thoughts into visual intelligence with AI assistance**

VThinker is a next-generation mind mapping and visual brainstorming tool that combines an infinite canvas with powerful AI language models to help you think better, create faster, and organize ideas effortlessly.

![VThinker Banner](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-18-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎨 Infinite Canvas
- Unlimited space for your ideas
- Smooth pan and zoom
- Grid background for spatial awareness
- Mini-map for navigation

### 🧩 Smart Nodes
- **Text Nodes** - Quick idea capture
- **Idea Nodes** - Highlight brilliant thoughts with lightbulb icons
- **Note Nodes** - Detailed multi-line content
- **Image Nodes** - Add visual content with image URLs
- **Link Nodes** - Embed web URLs with clickable links
- **Task Nodes** - Interactive checklists with completion tracking
- **Framework Nodes** - Structured thinking templates
- Double-click to edit, drag to move

### 📥 Content Import (NEW!)
- **YouTube to Mind Map** - Convert YouTube videos to structured maps
- **URL to Mind Map** - Transform web pages into mind maps
- **Text to Mind Map** - Paste any text and auto-generate structure
- AI-powered content extraction
- One-click mind map generation

### 🤖 AI Assistant
- Chat-based AI helper
- Quick action buttons
- Context-aware suggestions
- Brainstorming assistance
- Framework guidance

### 🧠 Thinking Frameworks
- **SWOT Analysis** - Strengths, Weaknesses, Opportunities, Threats
- **Six Thinking Hats** - Multiple perspective thinking
- **SCAMPER** - Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse
- **First Principles** - Break down to fundamental truths
- **Business Model Canvas** - 9-block business framework
- **Mind Maps** - Hierarchical organization

### 🔗 Connections
- Visual node linking
- Animated connections
- Drag from node edges to connect
- Automatic routing

### 📤 Export
- Export to JSON (save/load)
- PNG export (high-resolution image)
- PDF export (formatted document)
- PowerPoint slides (multi-slide presentation)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/vthinker.git
cd vthinker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

---

## 💡 How to Use

### Creating Nodes
1. Click the toolbar at the top
2. Select node type (Text, Idea, or Note)
3. Node appears on canvas
4. Double-click to edit

### Connecting Nodes
1. Hover over a node
2. Drag from the connection point (edge)
3. Release on target node
4. Animated connection created

### Using AI Assistant
1. Click "AI Assistant" in the header
2. Try quick actions or type a message
3. AI provides suggestions and frameworks
4. Apply suggestions to your canvas

### Adding Frameworks
1. Click the Brain icon in toolbar
2. Select a framework (SWOT, Six Hats, etc.)
3. Framework node appears on canvas
4. Fill in each section

### Exporting Your Work
1. Click "Export" in the header
2. Choose format:
   - **JSON** - Save and restore your work
   - **PNG Image** - High-resolution image export
   - **PDF** - Formatted PDF document
   - **Presentation** - Multi-slide PowerPoint with title, overview, and summary slides
3. File downloads automatically

---

## 🎯 Use Cases

### 📚 Learning & Study
- Take visual notes from lectures
- Create study mind maps
- Organize research topics
- Prepare for exams

### 💼 Business Strategy
- Strategic planning
- SWOT analysis
- Business model canvas
- Project planning

### ✍️ Creative Writing
- Plot development
- Character profiles
- World-building
- Story arcs

### 🚀 Product Development
- Feature brainstorming
- User story mapping
- Technical architecture
- Sprint planning

---

## 🛠️ Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Canvas:** React Flow (@xyflow/react)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** JavaScript (ES6+)

---

## 📐 Project Structure

```
vthinker/
├── src/
│   ├── components/
│   │   ├── CanvasToolbar.jsx      # Main toolbar
│   │   ├── AISidebar.jsx          # AI chat interface
│   │   ├── CustomNodes.jsx        # Node type definitions
│   │   ├── FrameworksModal.jsx    # Framework selection
│   │   └── ...
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions
│   ├── data/                      # Mock data & constants
│   ├── App.jsx                    # Main application
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── public/                        # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── README.md
└── VTHINKER_ROADMAP.md           # Complete product roadmap
```

---

## 🗺️ Roadmap

See [VTHINKER_ROADMAP.md](./VTHINKER_ROADMAP.md) for the comprehensive product roadmap including:
- Feature specifications
- Development timeline
- Business strategy
- Technical architecture
- Future vision

### Upcoming Features

**Phase 2 (Next 4-6 weeks):**
- Real AI integration (OpenAI, Anthropic)
- Image nodes
- Link/web content nodes
- Task list nodes
- Real-time collaboration
- Advanced export (PDF, PowerPoint)

**Phase 3 (3-6 months):**
- Mobile apps (iOS & Android)
- Browser extension
- Template marketplace
- Advanced analytics
- Team workspaces

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Write clear commit messages
- Test your changes

---

## 🆕 Latest Updates (v3.0)

### Major Feature Additions:
- ✅ **Professional Export Suite** - PNG, PDF, and PowerPoint presentation exports
- ✅ **Import from YouTube/URL/Text** - Generate mind maps from external content
- ✅ **Image Nodes** - Add and display images in your mind maps
- ✅ **Link Nodes** - Embed clickable web links
- ✅ **Task List Nodes** - Interactive checklists with checkboxes
- ✅ **SCAMPER Framework** - Creative problem-solving method
- ✅ **First Principles Thinking** - Break down complex problems
- ✅ **Business Model Canvas** - Complete 9-block business framework

### Comparison with FunBlocks AIFlow:
VThinker now includes most of the core features from FunBlocks AIFlow:
- ✅ Multiple thinking frameworks
- ✅ Import from YouTube/URLs
- ✅ Advanced node types (image, link, task)
- ✅ AI-assisted brainstorming
- ⏳ Content transformation (slides/infographics) - Coming soon
- ⏳ Real AI API integration - Coming soon

See [FUNBLOCKS_ANALYSIS.md](./FUNBLOCKS_ANALYSIS.md) for detailed feature comparison.

## 🐛 Known Issues

- [ ] Undo/Redo not fully functional
- [ ] AI responses are simulated (architecture ready for real API)
- [ ] Import feature uses simulated AI (ready for real implementation)
- [ ] No user authentication or cloud storage yet
- [ ] Markdown export not yet implemented
- [ ] Infographics export planned

See [Issues](https://github.com/your-username/vthinker/issues) for full list.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by [FunBlocks AIFlow](https://funblocks.net/)
- Built with [React Flow](https://reactflow.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Contact

- **Website:** [https://vthinker.app](https://vthinker.app) (coming soon)
- **Email:** hello@vthinker.app
- **Twitter:** [@VThinkerApp](https://twitter.com/VThinkerApp)
- **Discord:** [Join our community](https://discord.gg/vthinker)

---

## ⭐ Support

If you find VThinker helpful, please consider:
- Giving us a star on GitHub ⭐
- Sharing with your network
- Contributing to the project
- Providing feedback

---

**Built with ❤️ for visual thinkers everywhere**
