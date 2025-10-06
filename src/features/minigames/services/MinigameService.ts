import {
  MinigameType,
  Difficulty,
  MinigameSession,
  MinigameQuestion,
  MinigameResult,
  MinigameReward,
} from '../types';
import { osmTriviaQuestions } from '../data/osmTriviaQuestions';
import { tagPuzzleQuestions } from '../data/tagPuzzleData';

export class MinigameService {
  private static readonly BASE_XP = {
    [Difficulty.EASY]: 10,
    [Difficulty.MEDIUM]: 20,
    [Difficulty.HARD]: 30,
  };

  private static readonly SPEED_BONUS_THRESHOLD = {
    [Difficulty.EASY]: 60,
    [Difficulty.MEDIUM]: 90,
    [Difficulty.HARD]: 120,
  };

  private static readonly PERFECT_SCORE_BONUS = 50;
  private static readonly QUESTIONS_PER_SESSION = 5;

  static startSession(
    type: MinigameType,
    difficulty: Difficulty,
  ): MinigameSession {
    const questions = this.getQuestionsByType(type, difficulty);
    const selectedQuestions = this.selectRandomQuestions(
      questions,
      this.QUESTIONS_PER_SESSION,
    );

    return {
      id: this.generateSessionId(),
      type,
      difficulty,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      score: 0,
      startedAt: Date.now(),
      answers: {},
    };
  }

  static answerQuestion(
    session: MinigameSession,
    questionId: string,
    answer: string,
  ): MinigameSession {
    const question = session.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const isCorrect = answer === question.correctAnswer;
    const newScore = isCorrect ? session.score + 1 : session.score;

    return {
      ...session,
      score: newScore,
      answers: {
        ...session.answers,
        [questionId]: answer,
      },
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };
  }

  static completeSession(session: MinigameSession): MinigameResult {
    const completedAt = Date.now();
    const timeElapsed = Math.floor((completedAt - session.startedAt) / 1000);
    const correctAnswers = session.score;
    const totalQuestions = session.questions.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    const reward = this.calculateReward(
      session.difficulty,
      correctAnswers,
      totalQuestions,
      timeElapsed,
    );

    return {
      session: {
        ...session,
        completedAt,
      },
      correctAnswers,
      totalQuestions,
      accuracy,
      timeElapsed,
      reward,
    };
  }

  private static calculateReward(
    difficulty: Difficulty,
    correctAnswers: number,
    totalQuestions: number,
    timeElapsed: number,
  ): MinigameReward {
    const baseXp = this.BASE_XP[difficulty];
    const xpPerQuestion = correctAnswers * baseXp;

    let bonus = 0;

    const isPerfect = correctAnswers === totalQuestions;
    if (isPerfect) {
      bonus += this.PERFECT_SCORE_BONUS;
    }

    const speedThreshold = this.SPEED_BONUS_THRESHOLD[difficulty];
    if (timeElapsed < speedThreshold && isPerfect) {
      bonus += 25;
    }

    const total = xpPerQuestion + bonus;

    return {
      xp: xpPerQuestion,
      bonus,
      total,
    };
  }

  private static getQuestionsByType(
    type: MinigameType,
    difficulty: Difficulty,
  ): MinigameQuestion[] {
    let allQuestions: MinigameQuestion[] = [];

    switch (type) {
      case MinigameType.OSM_TRIVIA:
        allQuestions = osmTriviaQuestions;
        break;
      case MinigameType.TAG_PUZZLE:
        allQuestions = tagPuzzleQuestions;
        break;
    }

    return allQuestions.filter((q) => q.difficulty === difficulty);
  }

  private static selectRandomQuestions(
    questions: MinigameQuestion[],
    count: number,
  ): MinigameQuestion[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  private static generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
