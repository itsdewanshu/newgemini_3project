export type QuestionType = 'mcq_single' | 'mcq_multi' | 'true_false' | 'fill_blank' | 'match' | 'media' | 'hotspot';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // For MCQs. For True/False, usually ['True', 'False']
  correctAnswers: string[]; // Array of correct answer strings. For single choice, just one item.
  explanation?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
  mediaUrl?: string;
  mediaType?: 'audio' | 'video' | 'image';
  hotspotTarget?: { x: number; y: number };
}

export interface QuizSet {
  id?: number; // Optional for new sets before saving to DB
  title: string;
  description?: string;
  createdAt: number; // Timestamp for easy serialization
  questions: Question[];
}
