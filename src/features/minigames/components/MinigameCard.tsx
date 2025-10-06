import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../shared/ui';
import { spacing, radius } from '../../../shared/tokens';
import { useTheme } from '../../../shared/theme';
import { MinigameType, Difficulty } from '../types';

interface MinigameCardProps {
  type: MinigameType;
  difficulty: Difficulty;
  onPress: () => void;
}

export const MinigameCard: React.FC<MinigameCardProps> = ({
  type,
  difficulty,
  onPress,
}) => {
  const { colors } = useTheme();

  const getTitle = () => {
    switch (type) {
      case MinigameType.OSM_TRIVIA:
        return 'OSM Trivia';
      case MinigameType.TAG_PUZZLE:
        return 'Tag-Puzzle';
    }
  };

  const getDescription = () => {
    switch (type) {
      case MinigameType.OSM_TRIVIA:
        return 'Teste dein Wissen über OpenStreetMap Tags';
      case MinigameType.TAG_PUZZLE:
        return 'Finde den passenden Tag für verschiedene Orte';
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'Einfach';
      case Difficulty.MEDIUM:
        return 'Mittel';
      case Difficulty.HARD:
        return 'Schwer';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return colors.success[500];
      case Difficulty.MEDIUM:
        return colors.warning[500];
      case Difficulty.HARD:
        return colors.error[500];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface.secondary,
          borderColor: colors.border.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text variant="h4" color={colors.text.primary}>
          {getTitle()}
        </Text>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor() },
          ]}
        >
          <Text variant="caption" color={colors.text.inverse}>
            {getDifficultyLabel()}
          </Text>
        </View>
      </View>
      <Text variant="bodySmall" color={colors.text.secondary}>
        {getDescription()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[2],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
});
