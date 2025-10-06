import {
  IMinigameDataSource,
  MinigameData,
  MinigameSessionRecord,
} from '../ports/datasource.port';
import { osmTriviaQuestions } from '../../features/minigames/data/osmTriviaQuestions';
import { tagPuzzleQuestions } from '../../features/minigames/data/tagPuzzleData';

export class SeedMinigameAdapter implements IMinigameDataSource {
  private sessions: MinigameSessionRecord[] = [];

  async getQuestions(
    type: string,
    difficulty: string,
    limit: number,
  ): Promise<MinigameData[]> {
    let allQuestions = [...osmTriviaQuestions, ...tagPuzzleQuestions];

    const filtered = allQuestions.filter(
      (q) => q.type === type && q.difficulty === difficulty,
    );

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(limit, filtered.length));

    return selected.map((q) => ({
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      osmTag: q.osmTag,
    }));
  }

  async saveSession(session: MinigameSessionRecord): Promise<void> {
    this.sessions.push(session);
  }

  async getSessionHistory(
    userId: string,
    limit: number = 10,
  ): Promise<MinigameSessionRecord[]> {
    return this.sessions
      .filter((s) => s.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )
      .slice(0, limit);
  }
}
