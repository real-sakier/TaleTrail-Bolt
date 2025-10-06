export enum DataSourceMode {
  SEED = 'seed',
  MOCK = 'mock',
  LIVE = 'live',
}

export interface DataSourceConfig {
  mode: DataSourceMode;
}

export interface MinigameData {
  id: string;
  type: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: string;
  osmTag?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  level: number;
  xp: number;
  totalXp: number;
  createdAt: string;
}

export interface MinigameSessionRecord {
  id: string;
  userId: string;
  type: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeElapsed: number;
  xpEarned: number;
  completedAt: string;
}

export interface IMinigameDataSource {
  getQuestions(type: string, difficulty: string, limit: number): Promise<MinigameData[]>;
  saveSession(session: MinigameSessionRecord): Promise<void>;
  getSessionHistory(userId: string, limit?: number): Promise<MinigameSessionRecord[]>;
}

export interface IUserDataSource {
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  addXp(userId: string, xp: number): Promise<UserProfile>;
}
