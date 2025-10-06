import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, Button, Card, Badge, Progress } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';
import { useLocation } from '../../features/location/hooks/useLocation';
import { PermissionStatus } from '../../core/ports/location.port';
import {
  MinigameType,
  Difficulty,
  MinigameCard,
  QuestionView,
  useMinigame,
} from '../../features/minigames';

export const HomeScreen: React.FC = () => {
  const { colors, toggleColorScheme, colorScheme } = useTheme();
  const {
    position,
    permission,
    isLoading,
    error,
    requestPermission,
    getCurrentPosition,
  } = useLocation();
  const { session, result, startGame, answerQuestion, completeGame, resetGame } =
    useMinigame();
  const [isGameVisible, setIsGameVisible] = useState(false);

  const handleRequestLocation = async () => {
    try {
      if (permission?.status !== PermissionStatus.GRANTED) {
        await requestPermission();
      }
      await getCurrentPosition();
    } catch {
      Alert.alert(
        'Standort-Fehler',
        error?.message || 'Standort konnte nicht abgerufen werden',
      );
    }
  };

  const handleStartGame = (type: MinigameType, difficulty: Difficulty) => {
    startGame(type, difficulty);
    setIsGameVisible(true);
  };

  const handleCloseGame = () => {
    setIsGameVisible(false);
    resetGame();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h1" color={colors.text.primary}>
            Taletrail
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Design System Demo
          </Text>
        </View>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Standort
          </Text>
          <View style={styles.locationInfo}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Status:{' '}
              {permission?.status === PermissionStatus.GRANTED
                ? 'Berechtigt'
                : permission?.status === PermissionStatus.DENIED
                  ? 'Verweigert'
                  : 'Nicht angefragt'}
            </Text>
            {position && (
              <>
                <Text variant="bodySmall" color={colors.text.secondary}>
                  Breitengrad: {position.coords.latitude.toFixed(4)}°
                </Text>
                <Text variant="bodySmall" color={colors.text.secondary}>
                  Längengrad: {position.coords.longitude.toFixed(4)}°
                </Text>
                {position.coords.accuracy && (
                  <Text variant="caption" color={colors.text.tertiary}>
                    Genauigkeit: {position.coords.accuracy.toFixed(0)}m
                  </Text>
                )}
              </>
            )}
            {error && (
              <Text variant="bodySmall" color={colors.error[500]}>
                Fehler: {error.message}
              </Text>
            )}
          </View>
          <Button
            onPress={handleRequestLocation}
            fullWidth
            disabled={isLoading}
          >
            {isLoading
              ? 'Lade...'
              : position
                ? 'Aktualisieren'
                : 'Standort abrufen'}
          </Button>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Theme
          </Text>
          <Button onPress={toggleColorScheme} fullWidth>
            {colorScheme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </Button>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Rarity Badges
          </Text>
          <View style={styles.badgeRow}>
            <Badge rarity="common" label="Common" />
            <Badge rarity="rare" label="Rare" />
            <Badge rarity="epic" label="Epic" />
            <Badge rarity="legendary" label="Legendary" />
          </View>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Progress Bars
          </Text>
          <View style={styles.progressSection}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Experience: 45/100
            </Text>
            <Progress value={45} max={100} color={colors.primary[500]} />
          </View>
          <View style={styles.progressSection}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Quest Progress: 3/5
            </Text>
            <Progress value={3} max={5} color={colors.success[500]} />
          </View>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Buttons
          </Text>
          <View style={styles.buttonGroup}>
            <Button variant="primary" fullWidth>
              Primary Button
            </Button>
            <Button variant="secondary" fullWidth>
              Secondary Button
            </Button>
            <Button variant="outline" fullWidth>
              Outline Button
            </Button>
            <Button variant="ghost" fullWidth>
              Ghost Button
            </Button>
          </View>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Typography
          </Text>
          <View style={styles.typographySection}>
            <Text variant="h1" color={colors.text.primary}>
              Heading 1
            </Text>
            <Text variant="h2" color={colors.text.primary}>
              Heading 2
            </Text>
            <Text variant="h3" color={colors.text.primary}>
              Heading 3
            </Text>
            <Text variant="h4" color={colors.text.primary}>
              Heading 4
            </Text>
            <Text variant="body" color={colors.text.primary}>
              Body text with normal line height for comfortable reading.
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Small body text for less important information.
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Caption text for fine print
            </Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Minispiele
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
            Teste dein Wissen und sammle XP!
          </Text>
          <View style={styles.minigamesGrid}>
            <MinigameCard
              type={MinigameType.OSM_TRIVIA}
              difficulty={Difficulty.EASY}
              onPress={() =>
                handleStartGame(MinigameType.OSM_TRIVIA, Difficulty.EASY)
              }
            />
            <MinigameCard
              type={MinigameType.OSM_TRIVIA}
              difficulty={Difficulty.MEDIUM}
              onPress={() =>
                handleStartGame(MinigameType.OSM_TRIVIA, Difficulty.MEDIUM)
              }
            />
            <MinigameCard
              type={MinigameType.TAG_PUZZLE}
              difficulty={Difficulty.EASY}
              onPress={() =>
                handleStartGame(MinigameType.TAG_PUZZLE, Difficulty.EASY)
              }
            />
            <MinigameCard
              type={MinigameType.TAG_PUZZLE}
              difficulty={Difficulty.HARD}
              onPress={() =>
                handleStartGame(MinigameType.TAG_PUZZLE, Difficulty.HARD)
              }
            />
          </View>
        </Card>
      </ScrollView>

      {session && (
        <QuestionView
          session={session}
          onAnswer={answerQuestion}
          onComplete={completeGame}
          result={result || undefined}
          visible={isGameVisible}
          onClose={handleCloseGame}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    gap: spacing[4],
  },
  header: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  subtitle: {
    marginTop: spacing[1],
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    marginBottom: spacing[2],
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  progressSection: {
    gap: spacing[2],
  },
  buttonGroup: {
    gap: spacing[3],
  },
  typographySection: {
    gap: spacing[3],
  },
  locationInfo: {
    gap: spacing[2],
  },
  minigamesGrid: {
    gap: spacing[3],
  },
});
