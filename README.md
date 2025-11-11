# MonkeyCode

> Transform coding practice into a typing game. Master algorithmic patterns while building muscle memory for code.

---

## Project Summary

MonkeyCode is a **Monkeytype-inspired coding practice tool** that helps developers improve their coding speed and algorithmic thinking through deliberate practice. Instead of typing random words, you type real LeetCode-style solutions and common coding patterns.

### Key Features
- **42 LeetCode Problems** - Organized by NeetCode topics (arrays, strings, trees, graphs, etc.)
- **8 Micro Drills** - Practice common patterns (two pointers, sliding window, BFS, DFS)
- **Real-time Metrics** - WPM, accuracy tracking with Monkeytype-style UI
- **Supabase Backend** - Cloud database with local fallback for reliability
- **Minimal UI** - Clean, distraction-free interface inspired by Monkeytype
- **Performance Tracking** - Session history and statistics

---

## Tech Stack

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS for maximum performance
- **HTML5/CSS3** - Semantic markup with custom CSS (Monkeytype color scheme)
- **Chart.js** - Data visualization for statistics

### Backend & Database
- **Supabase** - PostgreSQL database with REST API
  - Row Level Security (RLS) for read-only public access
  - Real-time subscriptions capability
- **@supabase/supabase-js** (v2.81.1) - Official JavaScript client

### Deployment & Hosting
- **Vercel** - Serverless deployment with automatic CI/CD
- **Express.js** - Optional local development server
- **Node.js** - Runtime for import scripts and local dev

### Development Tools
- **dotenv** - Environment variable management
- **Git** - Version control
- **npm** - Package management

---

## Project Structure

```
MonkeyCode/
│
├── index.html                  # Main application page
├── stats.html                  # Statistics dashboard
├── manifest.json               # PWA manifest (future)
├── vercel.json                 # Vercel deployment config
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
│
├── js/                         # JavaScript modules
│   ├── app.js                  # Main application controller
│   ├── problems.js             # Local problems database (fallback)
│   ├── supabase-client.js      # Supabase integration with caching
│   ├── typing-engine.js        # Core typing logic and input handling
│   ├── performance-tracker.js  # Metrics calculation and storage
│   └── stats.js                # Statistics page logic
│
├── styles/                     # CSS stylesheets
│   ├── main.css                # Main application styles
│   └── stats.css               # Statistics page styles
│
└── scripts/                    # Utility scripts
    └── import-to-supabase.js   # One-time data migration script
```

Check out the MVP version here: https://monkey-code.vercel.app/

<img width="1563" height="878" alt="image" src="https://github.com/user-attachments/assets/c367fb92-4e3f-4147-9f0a-2f48db5bf16f" />

