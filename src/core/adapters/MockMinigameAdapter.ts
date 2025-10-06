import {
  IMinigameDataSource,
  MinigameData,
  MinigameSessionRecord,
} from '../ports/datasource.port';

export class MockMinigameAdapter implements IMinigameDataSource {
  private mockQuestions: MinigameData[] = [
    {
      id: 'mock-1',
      type: 'OSM_TRIVIA',
      difficulty: 'EASY',
      question: 'Mock-Frage: Was ist ein amenity=cafe?',
      options: ['Cafe', 'Restaurant', 'Bar', 'Shop'],
      correctAnswer: 'Cafe',
      osmTag: 'amenity=cafe',
    },
    {
      id: 'mock-2',
      type: 'OSM_TRIVIA',
      difficulty: 'EASY',
      question: 'Mock-Frage: Was ist ein shop=bakery?',
      options: ['Bäckerei', 'Supermarkt', 'Metzger', 'Apotheke'],
      correctAnswer: 'Bäckerei',
      osmTag: 'shop=bakery',
    },
    {
      id: 'mock-3',
      type: 'TAG_PUZZLE',
      difficulty: 'MEDIUM',
      question: 'Mock-Frage: Finde den Tag für einen Fußballplatz',
      options: ['sport=soccer', 'leisure=pitch', 'amenity=sports', 'sport=field'],
      correctAnswer: 'leisure=pitch',
      osmTag: 'leisure=pitch',
    },
  ];

  private sessions: MinigameSessionRecord[] = [];

  async getQuestions(
    type: string,
    difficulty: string,
    limit: number,
  ): Promise<MinigameData[]> {
    const filtered = this.mockQuestions.filter(
      (q) => q.type === type && q.difficulty === difficulty,
    );

    const result = filtered.slice(0, limit);

    while (result.length < limit) {
      result.push({
        id: `mock-generated-${result.length}`,
        type,
        difficulty,
        question: `Mock-Frage ${result.length + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      });
    }

    return result;
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
