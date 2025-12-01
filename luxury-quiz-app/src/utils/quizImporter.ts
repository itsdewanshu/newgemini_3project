import { QuizSet, Question, QuestionType } from '../types/quizTypes';

export const importQuizFile = (file: File): Promise<Omit<QuizSet, 'id'>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        // Basic structure validation
        if (!json || typeof json !== 'object') {
          throw new Error('Invalid JSON: Root must be an object.');
        }

        if (typeof json.title !== 'string' || !json.title.trim()) {
          throw new Error('Invalid Quiz: Missing or empty "title".');
        }

        if (!Array.isArray(json.questions) || json.questions.length === 0) {
          throw new Error('Invalid Quiz: "questions" must be a non-empty array.');
        }

        // Normalize and validate questions
        const normalizedQuestions: Question[] = json.questions.map((q: any, index: number) => {
          if (!q.questionText || typeof q.questionText !== 'string') {
            throw new Error(`Question ${index + 1}: Missing "questionText".`);
          }

          if (!Array.isArray(q.correctAnswers)) {
             throw new Error(`Question ${index + 1}: "correctAnswers" must be an array of strings.`);
          }

          // Default to mcq_single if type is missing or invalid, or validate strictly
          const validTypes: QuestionType[] = ['mcq_single', 'mcq_multi', 'true_false', 'fill_blank'];
          const type: QuestionType = validTypes.includes(q.type) ? q.type : 'mcq_single';

          return {
            id: q.id || `q-${Date.now()}-${index}`,
            type,
            questionText: q.questionText,
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswers: q.correctAnswers,
            explanation: typeof q.explanation === 'string' ? q.explanation : undefined,
            difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
            tags: Array.isArray(q.tags) ? q.tags : []
          };
        });

        const normalizedQuiz: Omit<QuizSet, 'id'> = {
          title: json.title,
          description: typeof json.description === 'string' ? json.description : '',
          createdAt: Date.now(), // Using timestamp to match QuizSet interface (number)
          questions: normalizedQuestions
        };

        resolve(normalizedQuiz);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error parsing quiz file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsText(file);
  });
};
