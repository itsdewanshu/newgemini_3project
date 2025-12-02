import React, { useState, useRef } from 'react';
import { useCurrentTheme } from '../hooks/useCurrentTheme';
import { importQuizFile } from '../utils/quizImporter';
import { addQuizSet } from '../db/quizDb';
import { QuizSet } from '../types/quizTypes';

interface ImportExportScreenProps {
  quizSets: QuizSet[];
  onImportSuccess: () => void;
  onStartQuiz: (id: number) => void;
  onDeleteQuiz: (id: number) => void;
  onOpenEditor: () => void;
}

const ImportExportScreen: React.FC<ImportExportScreenProps> = ({
  quizSets,
  onImportSuccess,
  onStartQuiz,
  onDeleteQuiz,
  onOpenEditor,
}) => {
  const { theme } = useCurrentTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredQuizzes = quizSets.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFile = async (file: File) => {
    if (!file) return;
    setImporting(true);
    setError(null);
    try {
      const quiz = await importQuizFile(file);
      await addQuizSet(quiz);
      onImportSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import quiz.');
    } finally {
      setImporting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Quiz Library</h2>
        <p className={`text-xs ${theme.colors.text.secondary}`}>Import new challenges or manage your collection</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="Search your quizzes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-3 pl-10 rounded-xl border bg-black/20 ${theme.colors.text.primary} ${theme.colors.card.border} focus:outline-none focus:border-white/30 transition-colors`}
        />
        <svg className="w-5 h-5 absolute left-3 top-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300
          ${isDragging ? 'border-amber-500 bg-amber-500/10' : `${theme.colors.card.border} hover:border-opacity-50 hover:bg-white/5`}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".json"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className={`p-3 rounded-full ${theme.colors.button.secondary}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className={`text-sm font-medium ${theme.colors.text.primary}`}>
              {importing ? 'Importing...' : 'Click to upload or drag JSON'}
            </p>
          </div>
        </div>
        {error && (
          <div className="absolute inset-x-0 -bottom-10 text-center">
            <span className="text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded-full border border-red-500/20">
              {error}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onOpenEditor}
        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${theme.colors.button.primary} hover:shadow-lg`}
      >
        + Create New Quiz
      </button>

      {/* Quiz List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 h-[400px] md:h-auto">
        {filteredQuizzes.length === 0 ? (
          <div className={`text-center py-8 text-sm ${theme.colors.text.secondary}`}>
            {searchQuery ? 'No quizzes match your search.' : 'No quizzes found. Import one to get started.'}
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme.colors.card.bg} ${theme.colors.card.border} hover:border-opacity-50`}
            >
              <div className="flex-1 min-w-0 mr-3">
                <h3 className={`text-sm font-bold truncate ${theme.colors.text.primary}`}>{quiz.title}</h3>
                <div className={`flex gap-2 text-[10px] mt-0.5 ${theme.colors.text.secondary}`}>
                  <span>{quiz.questions.length} Qs</span>
                  <span>•</span>
                  <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); if (quiz.id) onStartQuiz(quiz.id); }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${theme.colors.button.primary} ${theme.colors.button.hover}`}
                >
                  Start
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (quiz.id) onDeleteQuiz(quiz.id); }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20`}
                >
                  Del
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImportExportScreen;
