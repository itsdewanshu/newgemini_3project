import { useState, useEffect, useCallback } from 'react';
import { getAllQuizSets } from '../db/quizDb';
import { QuizSet } from '../types/quizTypes';

export function useQuizBank() {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sets = await getAllQuizSets();
      setQuizSets(sets);
    } catch (err) {
      console.error('Failed to load quiz sets:', err);
      setError('Failed to load quiz library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { quizSets, loading, error, refresh };
}
