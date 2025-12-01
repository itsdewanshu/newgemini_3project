# Luxury Quiz Engine

A premium, fully frontend quiz web app built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.  
Designed with glassmorphism, black–gold premium, and neon zen aesthetics, featuring smooth cinematic transitions and a luxury user experience.

---

## ✨ Features

- **Frontend-Only**: No backend, no network calls. All data is stored in the browser using IndexedDB.
- **Quiz Management**: Import, create, delete, and take quiz sets.
- **Multiple Modes**: Practice, Test, and Zen modes, each with unique themes.
- **Animated UI**: Framer Motion powers smooth screen transitions and interactive feedback.
- **Question Palette**: Collapsible, animated palette for quick navigation and review.
- **Keyboard Shortcuts**: Fast navigation (N/P/M/Enter/Esc) for power users.
- **Results & Analytics**: Animated score, breakdown, and feedback after each quiz.
- **Responsive & Accessible**: Works beautifully on desktop and mobile.

---

## 🗂️ Project Structure

```
luxury-quiz-app/
├── src/
│   ├── assets/                # Images, icons, etc.
│   ├── components/            # Reusable UI components
│   ├── db/                    # IndexedDB logic (quizDb.ts)
│   ├── engine/                # Pure quiz logic (quizEngine.ts)
│   ├── hooks/                 # Custom React hooks (useQuizBank, useCurrentTheme)
│   ├── screens/               # Main app screens (HomeScreen, QuizScreen, etc.)
│   ├── store/                 # React Context for quiz session state (quizStore.tsx)
│   ├── theme/                 # Theme config and tokens (themeConfig.ts)
│   ├── types/                 # TypeScript types (quizTypes.ts)
│   ├── utils/                 # Utilities (quizImporter.ts)
│   ├── App.tsx                # Main app component and screen router
│   └── main.tsx               # Entry point
├── public/
│   └── vite.svg
├── tailwind.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Quick Start (in Codespaces or locally)

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the dev server:**
   ```sh
   npm run dev
   ```
   - In Codespaces, the preview should open automatically.
   - Locally, open the printed URL in your browser, or use:
     ```sh
     "$BROWSER" http://localhost:5173
     ```

---

## 🧩 Core Technologies

- **React** (with hooks and context)
- **TypeScript** (strict typing)
- **Vite** (fast dev/build)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **IndexedDB** (browser storage, via native API)
- **No backend** (all logic and data is local)

---

## 🏗️ Main Features & Screens

### 1. **HomeScreen**
- Luxury dashboard with animated title and mode selection (Practice, Test, Zen).
- Theme switcher in the top-right.

### 2. **QuizLibraryScreen**
- Lists all quiz sets stored in IndexedDB.
- Start or delete any quiz.

### 3. **QuizScreen**
- Renders questions (MCQ single-choice for now).
- Animated transitions, palette for navigation, mark for review.
- Keyboard shortcuts:
  - `N`: Next question
  - `P`: Previous question
  - `M`: Mark/unmark for review
  - `Enter`: Confirm/next/submit
  - `Esc`: Toggle question palette

### 4. **ImportExportScreen**
- Drag-and-drop or select `.json` files to import quiz sets.
- Lists all quizzes with options to start or delete.

### 5. **SettingsScreen**
- (Placeholder for future settings)

### 6. **ResultsScreen**
- Animated score, progress ring, breakdown cards, and feedback.
- Buttons to retry, go to library, or home.

---

## 🗄️ Data Model

- **QuizSet**: `{ id, title, description, createdAt, questions: Question[] }`
- **Question**: `{ id, type, questionText, options?, correctAnswers, ... }`
- **Stored in**: IndexedDB (`luxuryQuizDB`, store: `quizSets`)

---

## 🛠️ Utilities

- **quizImporter.ts**: Safely imports and validates quiz JSON files.
- **quizEngine.ts**: Pure functions for quiz session logic (navigation, scoring, review, etc.).

---

## 🎨 Theming

- **practiceTheme**: Glassy, soft blues.
- **testTheme**: Black + gold premium.
- **zenTheme**: Neon purple/blue gradients.
- Switch themes instantly from the UI.

---

## 🧑‍💻 Developer Notes

- **No backend**: All logic and data is local to the browser.
- **No React Router**: Uses a simple state-based screen router.
- **All state**: Managed via React hooks and context.
- **Animations**: Framer Motion for screens and buttons.
- **IndexedDB**: Used directly for quiz persistence.

---

## 📝 Importing Quiz Sets

- Go to **Import/Export** screen.
- Drag a `.json` file or use the file picker.
- File must match the `QuizSet` structure (see `src/types/quizTypes.ts`).

---

## 🧹 Cleaning Up

- To clear all quizzes, clear your browser's IndexedDB for this site.

---

## 🆘 Troubleshooting

- **Missing dependencies?**  
  Run `npm install`.
- **Dev server won't start?**  
  Make sure `@vitejs/plugin-react` is installed.
- **Browser issues?**  
  Use a modern browser (Chrome, Edge, Firefox, Safari).

---

## 📦 Deployment

- This app is ready for static hosting (e.g., GitHub Pages).
- Build with:
  ```sh
  npm run build
  ```
  Then deploy the `dist/` folder.

---

## 🤝 Credits

- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).

---

Enjoy your luxury quiz experience!
