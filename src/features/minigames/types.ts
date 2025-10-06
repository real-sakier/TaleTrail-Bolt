export enum MinigameType {
  OSM_TRIVIA = 'OSM_TRIVIA',
  TAG_PUZZLE = 'TAG_PUZZLE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface MinigameQuestion {
  id: string;
  type: MinigameType;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  osmTag?: string;
}

export interface MinigameSession {
  id: string;
  type: MinigameType;
  difficulty: Difficulty;
  questions: MinigameQuestion[];
  currentQuestionIndex: number;
  score: number;
  startedAt: number;
  completedAt?: number;
  answers: Record<string, string>;
}

export interface MinigameReward {
  xp: number;
  bonus: number;
  total: number;
}

export interface MinigameResult {
  session: MinigameSession;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  timeElapsed: number;
  reward: MinigameReward;
}
