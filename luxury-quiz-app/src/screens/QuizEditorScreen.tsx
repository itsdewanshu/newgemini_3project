import React, { useState } from 'react';
import { useCurrentTheme } from '../hooks/useCurrentTheme';
import { Question, QuestionType, QuizSet } from '../types/quizTypes';
import { addQuizSet } from '../db/quizDb';
import QuestionCard from '../components/quiz/QuestionCard';

interface QuizEditorScreenProps {
  onExit: () => void;
}

const QuizEditorScreen: React.FC<QuizEditorScreenProps> = ({ onExit }) => {
  const { theme } = useCurrentTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(-1);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const newQuiz: Omit<QuizSet, 'id'> = {
      title,
      description,
      createdAt: Date.now(),
      questions,
    };

    try {
      await addQuizSet(newQuiz);
      alert('Quiz saved successfully!');
      onExit();
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz. Please try again.');
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'mcq_single',
      questionText: 'New Question',
      options: ['Option 1', 'Option 2'],
      correctAnswers: ['Option 1'],
      difficulty: 'medium',
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setActiveQuestionIndex(newQuestions.length - 1);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];

    if (field === 'type') {
      const newType = value as QuestionType;
      let newOptions: string[] = [];
      let newCorrectAnswers: string[] = [];

      switch (newType) {
        case 'true_false':
          newOptions = ['True', 'False'];
          newCorrectAnswers = ['True'];
          break;
        case 'fill_blank':
          newOptions = [];
          newCorrectAnswers = [''];
          break;
        case 'match':
          newOptions = ['Item A', 'Item B'];
          newCorrectAnswers = ['Match A', 'Match B'];
          break;
        default: // mcq_single, mcq_multi
          newOptions = ['Option 1', 'Option 2'];
          newCorrectAnswers = ['Option 1'];
          break;
      }

      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type: newType,
        options: newOptions,
        correctAnswers: newCorrectAnswers,
      };
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }

    setQuestions(updatedQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const newOptions = [...(updatedQuestions[qIndex].options || [])];
    newOptions[oIndex] = value;
    updatedQuestions[qIndex].options = newOptions;
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    const newOptions = [...(updatedQuestions[qIndex].options || []), `Option ${(updatedQuestions[qIndex].options?.length || 0) + 1}`];
    updatedQuestions[qIndex].options = newOptions;
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    const newOptions = [...(updatedQuestions[qIndex].options || [])];
    newOptions.splice(oIndex, 1);
    updatedQuestions[qIndex].options = newOptions;
    setQuestions(updatedQuestions);
  };

  const activeQuestion = activeQuestionIndex >= 0 ? questions[activeQuestionIndex] : null;

  return (
    <div className="flex h-full w-full gap-6">
      {/* Left Column: Form */}
      <div className={`flex-1 flex flex-col overflow-y-auto p-4 rounded-2xl border ${theme.colors.card.bg} ${theme.colors.card.border} custom-scrollbar`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme.colors.text.primary}`}>Create Quiz</h2>
            <div className="flex gap-4">
              <button 
                onClick={handleSave} 
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${theme.colors.button.primary} hover:shadow-lg transition-all`}
              >
                Save Quiz
              </button>
              <button onClick={onExit} className={`text-xs ${theme.colors.text.secondary} hover:text-white`}>Exit</button>
            </div>
        </div>

        <div className="space-y-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.colors.text.secondary}`}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded-lg bg-black/20 border border-white/10 ${theme.colors.text.primary} focus:outline-none focus:border-white/30`}
              placeholder="Enter quiz title..."
            />
          </div>
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.colors.text.secondary}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-lg bg-black/20 border border-white/10 ${theme.colors.text.primary} focus:outline-none focus:border-white/30 h-20 resize-none`}
              placeholder="Enter description..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-bold ${theme.colors.text.primary}`}>Questions ({questions.length})</h3>
            <button
                onClick={addQuestion}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${theme.colors.button.primary}`}
            >
                + Add Question
            </button>
        </div>

        <div className="flex-1 space-y-3">
            {questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${activeQuestionIndex === idx ? `${theme.colors.card.bg} border-white/30` : `bg-black/10 border-transparent hover:bg-white/5`}`}
                >
                    <div 
                      onClick={() => setActiveQuestionIndex(idx)}
                      className="p-3 flex justify-between items-center cursor-pointer"
                    >
                        <span className={`text-xs font-bold ${activeQuestionIndex === idx ? theme.colors.text.primary : theme.colors.text.secondary}`}>
                          {idx + 1}. {q.questionText || 'New Question'}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider ${theme.colors.text.secondary}`}>{q.type.replace('_', ' ')}</span>
                    </div>

                    {activeQuestionIndex === idx && (
                      <div className="p-4 pt-0 space-y-4 animate-fade-in">
                        {/* Question Text */}
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.colors.text.secondary}`}>Question Text</label>
                          <textarea
                            value={q.questionText}
                            onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                            className={`w-full p-2 rounded bg-black/20 border border-white/10 ${theme.colors.text.primary} text-sm focus:outline-none focus:border-white/30 h-20 resize-none`}
                          />
                        </div>

                        {/* Type & Correct Answer */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.colors.text.secondary}`}>Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => updateQuestion(idx, 'type', e.target.value as QuestionType)}
                              className={`w-full p-2 rounded bg-black/20 border border-white/10 ${theme.colors.text.primary} text-sm focus:outline-none focus:border-white/30`}
                            >
                              <option value="mcq_single">Single Choice</option>
                              <option value="mcq_multi">Multi Choice</option>
                              <option value="true_false">True/False</option>
                              <option value="fill_blank">Fill in Blank</option>
                              <option value="match">Match Pairs</option>
                            </select>
                          </div>
                          <div>
                            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.colors.text.secondary}`}>Correct Answer</label>
                            <input
                              type="text"
                              value={q.correctAnswers[0] || ''}
                              onChange={(e) => updateQuestion(idx, 'correctAnswers', [e.target.value])}
                              className={`w-full p-2 rounded bg-black/20 border border-white/10 ${theme.colors.text.primary} text-sm focus:outline-none focus:border-white/30`}
                              placeholder="Exact match..."
                            />
                          </div>
                        </div>

                        {/* Options (for MCQs) */}
                        {(q.type === 'mcq_single' || q.type === 'mcq_multi') && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className={`block text-[10px] font-bold uppercase tracking-wider ${theme.colors.text.secondary}`}>Options</label>
                              <button onClick={() => addOption(idx)} className={`text-[10px] text-blue-400 hover:text-blue-300`}>+ Add Option</button>
                            </div>
                            <div className="space-y-2">
                              {q.options?.map((opt, oIdx) => (
                                <div key={oIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                                    className={`flex-1 p-2 rounded bg-black/20 border border-white/10 ${theme.colors.text.primary} text-sm focus:outline-none focus:border-white/30`}
                                  />
                                  <button 
                                    onClick={() => removeOption(idx, oIdx)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className={`flex-1 flex flex-col p-6 rounded-2xl border ${theme.colors.card.bg} ${theme.colors.card.border} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-2 bg-black/40 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest text-white/50">
            Live Preview
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
            {activeQuestion ? (
              <div className="w-full animate-fade-in">
                <div className={`text-center mb-8`}>
                  <h1 className={`text-2xl font-bold mb-2 ${theme.colors.text.primary}`}>{title || 'Untitled Quiz'}</h1>
                  <div className={`text-xs font-bold tracking-widest uppercase ${theme.colors.text.secondary}`}>
                    Question {activeQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                
                <QuestionCard 
                  question={activeQuestion}
                  currentAnswer={activeQuestion.correctAnswers[0]} // Preview with correct answer selected
                  onAnswer={() => {}}
                  disabled={true}
                />
              </div>
            ) : (
              <div className={`text-center ${theme.colors.text.secondary}`}>
                <p className="mb-2">Select a question to preview</p>
                <p className="text-xs opacity-50">or add a new one to get started</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizEditorScreen;

