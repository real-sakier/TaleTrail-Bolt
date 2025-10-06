import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Text, Button, Card, Progress } from '../../../shared/ui';
import { spacing, radius } from '../../../shared/tokens';
import { useTheme } from '../../../shared/theme';
import { MinigameSession, MinigameResult } from '../types';

interface QuestionViewProps {
  session: MinigameSession;
  onAnswer: (questionId: string, answer: string) => void;
  onComplete: () => void;
  result?: MinigameResult;
  visible: boolean;
  onClose: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  session,
  onAnswer,
  onComplete,
  result,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion =
    session.questions[session.currentQuestionIndex] || null;
  const isLastQuestion =
    session.currentQuestionIndex >= session.questions.length;

  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;
    onAnswer(currentQuestion.id, selectedAnswer);
    setSelectedAnswer(null);
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.background.primary },
          ]}
        >
          {result ? (
            <View style={styles.resultContainer}>
              <Text variant="h2" color={colors.text.primary}>
                Fertig!
              </Text>
              <View style={styles.resultStats}>
                <Text variant="h4" color={colors.text.primary}>
                  {result.correctAnswers} / {result.totalQuestions} richtig
                </Text>
                <Text variant="body" color={colors.text.secondary}>
                  Genauigkeit: {result.accuracy.toFixed(0)}%
                </Text>
                <Text variant="body" color={colors.text.secondary}>
                  Zeit: {result.timeElapsed}s
                </Text>
              </View>
              <Card variant="elevated" style={styles.rewardCard}>
                <Text variant="h3" color={colors.text.primary}>
                  Belohnung
                </Text>
                <View style={styles.rewardDetails}>
                  <Text variant="body" color={colors.text.secondary}>
                    Basis-XP: {result.reward.xp}
                  </Text>
                  {result.reward.bonus > 0 && (
                    <Text variant="body" color={colors.success[500]}>
                      Bonus: +{result.reward.bonus}
                    </Text>
                  )}
                  <Text variant="h4" color={colors.primary[500]}>
                    Gesamt: {result.reward.total} XP
                  </Text>
                </View>
              </Card>
              <Button onPress={handleClose} fullWidth>
                Schließen
              </Button>
            </View>
          ) : isLastQuestion ? (
            <View style={styles.resultContainer}>
              <Text variant="h3" color={colors.text.primary}>
                Alle Fragen beantwortet!
              </Text>
              <Button onPress={onComplete} fullWidth>
                Ergebnis anzeigen
              </Button>
            </View>
          ) : currentQuestion ? (
            <>
              <View style={styles.header}>
                <Text variant="h3" color={colors.text.primary}>
                  Frage {session.currentQuestionIndex + 1} /{' '}
                  {session.questions.length}
                </Text>
                <Progress
                  value={session.currentQuestionIndex}
                  max={session.questions.length}
                  color={colors.primary[500]}
                />
              </View>
              <Card variant="elevated" style={styles.questionCard}>
                <Text variant="h4" color={colors.text.primary}>
                  {currentQuestion.question}
                </Text>
              </Card>
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        {
                          backgroundColor: colors.surface.secondary,
                          borderColor: isSelected
                            ? colors.primary[500]
                            : colors.border.primary,
                        },
                        isSelected && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleAnswerSelect(option)}
                    >
                      <Text
                        variant="body"
                        color={
                          isSelected ? colors.primary[500] : colors.text.primary
                        }
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.actions}>
                <Button
                  onPress={handleSubmit}
                  fullWidth
                  disabled={!selectedAnswer}
                >
                  Weiter
                </Button>
                <Button variant="outline" onPress={handleClose} fullWidth>
                  Abbrechen
                </Button>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: radius.xl,
    padding: spacing[6],
    gap: spacing[4],
  },
  header: {
    gap: spacing[2],
  },
  questionCard: {
    padding: spacing[4],
  },
  optionsContainer: {
    gap: spacing[3],
  },
  optionButton: {
    padding: spacing[4],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  optionButtonSelected: {
    borderWidth: 2,
  },
  actions: {
    gap: spacing[2],
  },
  resultContainer: {
    gap: spacing[4],
    alignItems: 'center',
  },
  resultStats: {
    gap: spacing[2],
    alignItems: 'center',
  },
  rewardCard: {
    width: '100%',
    padding: spacing[4],
    gap: spacing[3],
  },
  rewardDetails: {
    gap: spacing[1],
  },
});
