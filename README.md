# Luxury Quiz App

A sophisticated and immersive quiz application built with modern web technologies. This app offers a premium user experience with fluid animations, multiple game modes, and a robust quiz management system.

## 🌟 Features

### 🎮 Game Modes
- **Practice Mode:** Learn at your own pace with immediate feedback.
- **Test Mode:** Simulate a real exam environment.
- **Zen Mode:** A relaxing, particle-enhanced experience for stress-free learning.
- **Challenger Mode:** High-stakes mode for competitive users.

### 🧩 Diverse Question Types
- **Multiple Choice:** Single and multiple correct answers.
- **True/False:** Quick boolean questions.
- **Fill in the Blank:** Test recall memory.
- **Matching:** Interactive drag-and-drop matching questions.
- **Hotspot:** Visual questions requiring users to click specific areas on an image.
- **Media:** Questions incorporating audio, video, or images.

### 🛠️ Tools & Management
- **Quiz Editor:** Create and modify quizzes directly within the app.
- **Import/Export:** Share quizzes or backup your data using JSON.
- **Quiz Library:** Organize and browse your collection of quizzes.
- **Results & Analytics:** Detailed breakdown of your performance.

### 🎨 UI/UX
- **Dynamic Theming:** The interface adapts its color scheme and style based on the selected game mode.
- **Smooth Animations:** Powered by `framer-motion` for a polished feel.
- **Responsive Design:** Optimized for various screen sizes.

## 🏗️ Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Storage:** Native [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for local data persistence.

## 📂 Project Structure

```
luxury-quiz-app/
├── src/
│   ├── assets/          # Static assets and global styles
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Generic components (Buttons, Cards)
│   │   ├── layout/      # Layout components (ZenParticles)
│   │   └── quiz/        # Quiz-specific components (Renderers, Cards)
│   ├── db/              # IndexedDB configuration and helpers
│   ├── engine/          # Core quiz logic and scoring engine
│   ├── hooks/           # Custom React hooks (Theme, QuizBank)
│   ├── pages/           # Page components (if using routing)
│   ├── screens/         # Main application screens (Home, Quiz, Editor)
│   ├── services/        # External services or API calls
│   ├── store/           # State management (Context/Zustand)
│   ├── theme/           # Theme configuration and definitions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions (Importers, Formatters)
├── public/              # Public static files
└── ...config files      # Vite, Tailwind, TypeScript configs
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd luxury-quiz-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run serve
```

## 📖 Usage

1. **Select a Mode:** Choose from Practice, Test, Zen, or Challenger on the Home screen.
2. **Manage Quizzes:** Go to the Import/Export screen to add new quizzes or create one in the Editor.
3. **Take a Quiz:** Select a quiz from the Library and start answering questions.
4. **Review:** Check your results and learn from the explanations.

## 📄 License

This project is licensed under the MIT License.
