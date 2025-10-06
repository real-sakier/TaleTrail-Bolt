import { useState, useCallback } from 'react';
import {
  MinigameType,
  Difficulty,
  MinigameSession,
  MinigameResult,
} from '../types';
import { MinigameService } from '../services/MinigameService';

export const useMinigame = () => {
  const [session, setSession] = useState<MinigameSession | null>(null);
  const [result, setResult] = useState<MinigameResult | null>(null);

  const startGame = useCallback((type: MinigameType, difficulty: Difficulty) => {
    const newSession = MinigameService.startSession(type, difficulty);
    setSession(newSession);
    setResult(null);
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, answer: string) => {
      if (!session) return;
      const updatedSession = MinigameService.answerQuestion(
        session,
        questionId,
        answer,
      );
      setSession(updatedSession);
    },
    [session],
  );

  const completeGame = useCallback(() => {
    if (!session) return;
    const gameResult = MinigameService.completeSession(session);
    setResult(gameResult);
  }, [session]);

  const resetGame = useCallback(() => {
    setSession(null);
    setResult(null);
  }, []);

  return {
    session,
    result,
    startGame,
    answerQuestion,
    completeGame,
    resetGame,
  };
};
