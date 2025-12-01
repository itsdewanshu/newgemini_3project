# Luxury Quiz App

Welcome to the Luxury Quiz App! This is a frontend-only web application built using React, Vite, TypeScript, and Tailwind CSS. The app is designed to provide a luxurious quiz experience with a focus on premium design and user interaction.

## Features

- **Responsive Design**: The application is fully responsive and looks great on all devices.
- **Glassmorphism UI**: Utilizes glassmorphism effects to create a modern and elegant interface.
- **Quiz Functionality**: Users can take quizzes, select answers, and view results.
- **IndexedDB Storage**: Quiz data is stored locally using IndexedDB for fast access and offline capabilities.
- **GitHub Pages Hosting**: The application is hosted on GitHub Pages for easy access and sharing.

## Project Structure

The project is organized as follows:

```
luxury-quiz-app
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── styles.css
│   ├── components
│   │   ├── common
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── layout
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── quiz
│   │       ├── QuestionCard.tsx
│   │       ├── AnswerOption.tsx
│   │       └── ProgressBar.tsx
│   ├── hooks
│   │   ├── useQuiz.ts
│   │   └── useIndexedDB.ts
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Quiz.tsx
│   │   └── Results.tsx
│   ├── services
│   │   └── db.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   └── quizHelpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Getting Started

To get started with the Luxury Quiz App, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/luxury-quiz-app.git
   cd luxury-quiz-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` in your browser to view the application.

## Deployment

To deploy the application to GitHub Pages, run the following command:

```bash
npm run deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Thanks to the creators of React, Vite, TypeScript, and Tailwind CSS for their amazing tools and libraries.