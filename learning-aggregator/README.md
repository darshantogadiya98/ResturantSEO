# LearnHub - Learning Resource Aggregator

A modern, AI-powered platform that aggregates learning resources from across the internet with quality scoring and personalized roadmaps. Think of it as "Perplexity for Learning" - helping users discover, compare, and organize the best learning resources from multiple platforms.

## Features

### Core Features
- **Smart Search**: AI-powered search interface with auto-suggestions for popular learning topics
- **Multi-Platform Aggregation**: Resources from YouTube, Udemy, Coursera, edX, freeCodeCamp, GitHub, Medium, and more
- **Advanced Filtering**: Filter by resource type, difficulty level, price, platform, and duration
- **Quality Scoring**: Each resource has a quality score (1-10) based on ratings, reviews, and platform reputation
- **Learning Roadmaps**: Curated step-by-step learning paths for popular topics (Web Development, Machine Learning, etc.)
- **Resource Cards**: Beautiful, informative cards showing all key metadata at a glance

### Filtering Options
- **Resource Type**: Video Courses, Articles & Blogs, Books, Interactive, Podcasts, Projects
- **Difficulty Level**: Beginner, Intermediate, Advanced
- **Price**: Free, Paid, Freemium
- **Platform**: YouTube, Udemy, Coursera, edX, GitHub, Medium, freeCodeCamp, Pluralsight
- **Duration**: Short (<5h), Medium (5-20h), Long (20-50h), Extensive (50+h)

### Learning Roadmaps
Pre-built learning paths with:
- Step-by-step progression
- Recommended resources for each step
- Skills you'll gain
- Total time estimation
- Available for: Web Development, Machine Learning (more coming soon)

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd learning-aggregator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
learning-aggregator/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Main navigation header
│   │   ├── SearchBar.jsx       # AI-powered search with suggestions
│   │   ├── Filters.jsx         # Comprehensive filtering system
│   │   ├── ResourceCard.jsx    # Individual resource display
│   │   └── Roadmap.jsx         # Learning roadmap visualization
│   ├── data/
│   │   └── mockData.js         # Sample data (will be replaced with API)
│   ├── utils/                  # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Tailwind styles
│   └── main.jsx                # App entry point
├── public/                     # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Roadmap

### MVP (Current)
- [x] Clean, modern UI with Tailwind CSS
- [x] Search functionality
- [x] Resource cards with metadata
- [x] Advanced filtering system
- [x] Quality scoring display
- [x] Learning roadmap visualization
- [x] Responsive design

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] Real-time web scraping for resources
- [ ] User authentication
- [ ] Save favorites/bookmarks
- [ ] Personal learning progress tracking
- [ ] AI-generated personalized roadmaps
- [ ] Resource comparison tool
- [ ] Community reviews and ratings

### Phase 3 (Future)
- [ ] API integrations (YouTube, Udemy, Coursera, etc.)
- [ ] Advanced AI recommendations
- [ ] Learning analytics dashboard
- [ ] Social features (share roadmaps, follow learners)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Affiliate program integration

## Why LearnHub?

### The Problem
People waste countless hours figuring out:
- What to learn
- Where to learn from
- Which resource is best quality
- How to structure their learning journey

Learning resources are scattered across YouTube, Udemy, Coursera, blogs, GitHub, and more - making it hard to compare and choose.

### The Solution
LearnHub solves this by:
1. **Aggregating** all learning resources in one place
2. **Scoring** resources based on quality, reviews, and difficulty
3. **Filtering** by your specific needs (free/paid, beginner/advanced, etc.)
4. **Guiding** you with curated learning roadmaps
5. **Saving** you time by doing the research for you

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for learners worldwide**
