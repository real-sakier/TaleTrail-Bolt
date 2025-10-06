import { MinigameService } from '../services/MinigameService';
import { MinigameType, Difficulty } from '../types';

describe('MinigameService', () => {
  describe('startSession', () => {
    it('should create a new session with correct properties', () => {
      const session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      expect(session.type).toBe(MinigameType.OSM_TRIVIA);
      expect(session.difficulty).toBe(Difficulty.EASY);
      expect(session.questions.length).toBe(5);
      expect(session.currentQuestionIndex).toBe(0);
      expect(session.score).toBe(0);
      expect(session.startedAt).toBeLessThanOrEqual(Date.now());
      expect(session.answers).toEqual({});
    });

    it('should select questions with matching difficulty', () => {
      const session = MinigameService.startSession(
        MinigameType.TAG_PUZZLE,
        Difficulty.HARD,
      );

      session.questions.forEach((question) => {
        expect(question.difficulty).toBe(Difficulty.HARD);
        expect(question.type).toBe(MinigameType.TAG_PUZZLE);
      });
    });
  });

  describe('answerQuestion', () => {
    it('should increment score for correct answer', () => {
      const session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );
      const firstQuestion = session.questions[0];

      const updatedSession = MinigameService.answerQuestion(
        session,
        firstQuestion.id,
        firstQuestion.correctAnswer,
      );

      expect(updatedSession.score).toBe(1);
      expect(updatedSession.currentQuestionIndex).toBe(1);
      expect(updatedSession.answers[firstQuestion.id]).toBe(
        firstQuestion.correctAnswer,
      );
    });

    it('should not increment score for incorrect answer', () => {
      const session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );
      const firstQuestion = session.questions[0];
      const wrongAnswer = firstQuestion.options.find(
        (opt) => opt !== firstQuestion.correctAnswer,
      )!;

      const updatedSession = MinigameService.answerQuestion(
        session,
        firstQuestion.id,
        wrongAnswer,
      );

      expect(updatedSession.score).toBe(0);
      expect(updatedSession.currentQuestionIndex).toBe(1);
      expect(updatedSession.answers[firstQuestion.id]).toBe(wrongAnswer);
    });

    it('should throw error for non-existent question', () => {
      const session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      expect(() => {
        MinigameService.answerQuestion(session, 'invalid-id', 'some-answer');
      }).toThrow('Question not found');
    });
  });

  describe('completeSession', () => {
    it('should calculate correct reward for perfect score on easy', () => {
      let session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      session.questions.forEach((question) => {
        session = MinigameService.answerQuestion(
          session,
          question.id,
          question.correctAnswer,
        );
      });

      const result = MinigameService.completeSession(session);

      expect(result.correctAnswers).toBe(5);
      expect(result.totalQuestions).toBe(5);
      expect(result.accuracy).toBe(100);
      expect(result.reward.xp).toBe(50);
      expect(result.reward.bonus).toBeGreaterThanOrEqual(50);
      expect(result.reward.total).toBeGreaterThanOrEqual(100);
    });

    it('should calculate correct reward for partial score on medium', () => {
      let session = MinigameService.startSession(
        MinigameType.TAG_PUZZLE,
        Difficulty.MEDIUM,
      );

      session.questions.forEach((question, index) => {
        const answer =
          index < 3 ? question.correctAnswer : question.options[0];
        session = MinigameService.answerQuestion(session, question.id, answer);
      });

      const result = MinigameService.completeSession(session);

      expect(result.correctAnswers).toBe(3);
      expect(result.totalQuestions).toBe(5);
      expect(result.accuracy).toBe(60);
      expect(result.reward.xp).toBe(60);
      expect(result.reward.bonus).toBe(0);
      expect(result.reward.total).toBe(60);
    });

    it('should calculate correct reward for perfect score on hard', () => {
      let session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.HARD,
      );

      session.questions.forEach((question) => {
        session = MinigameService.answerQuestion(
          session,
          question.id,
          question.correctAnswer,
        );
      });

      const result = MinigameService.completeSession(session);

      expect(result.correctAnswers).toBe(5);
      expect(result.totalQuestions).toBe(5);
      expect(result.accuracy).toBe(100);
      expect(result.reward.xp).toBe(150);
      expect(result.reward.bonus).toBeGreaterThanOrEqual(50);
    });

    it('should include time elapsed in result', () => {
      const session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      const result = MinigameService.completeSession(session);

      expect(result.timeElapsed).toBeGreaterThanOrEqual(0);
      expect(typeof result.timeElapsed).toBe('number');
    });

    it('should award speed bonus for fast perfect completion', () => {
      let session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      session = {
        ...session,
        startedAt: Date.now() - 30000,
      };

      session.questions.forEach((question) => {
        session = MinigameService.answerQuestion(
          session,
          question.id,
          question.correctAnswer,
        );
      });

      const result = MinigameService.completeSession(session);

      expect(result.reward.bonus).toBe(75);
    });
  });

  describe('scoring logic', () => {
    it('should award 10 XP per correct answer on easy', () => {
      let session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.EASY,
      );

      session.questions.forEach((question, index) => {
        const answer = index < 3 ? question.correctAnswer : question.options[0];
        session = MinigameService.answerQuestion(session, question.id, answer);
      });

      const result = MinigameService.completeSession(session);
      expect(result.reward.xp).toBe(30);
    });

    it('should award 20 XP per correct answer on medium', () => {
      let session = MinigameService.startSession(
        MinigameType.TAG_PUZZLE,
        Difficulty.MEDIUM,
      );

      session.questions.forEach((question, index) => {
        const answer = index < 2 ? question.correctAnswer : question.options[0];
        session = MinigameService.answerQuestion(session, question.id, answer);
      });

      const result = MinigameService.completeSession(session);
      expect(result.reward.xp).toBe(40);
    });

    it('should award 30 XP per correct answer on hard', () => {
      let session = MinigameService.startSession(
        MinigameType.OSM_TRIVIA,
        Difficulty.HARD,
      );

      session.questions.forEach((question, index) => {
        const answer = index < 4 ? question.correctAnswer : question.options[0];
        session = MinigameService.answerQuestion(session, question.id, answer);
      });

      const result = MinigameService.completeSession(session);
      expect(result.reward.xp).toBe(120);
    });

    it('should award perfect score bonus (50 XP) for 100% accuracy', () => {
      let session = MinigameService.startSession(
        MinigameType.TAG_PUZZLE,
        Difficulty.EASY,
      );

      session.questions.forEach((question) => {
        session = MinigameService.answerQuestion(
          session,
          question.id,
          question.correctAnswer,
        );
      });

      const result = MinigameService.completeSession(session);
      expect(result.reward.bonus).toBeGreaterThanOrEqual(50);
    });
  });
});
