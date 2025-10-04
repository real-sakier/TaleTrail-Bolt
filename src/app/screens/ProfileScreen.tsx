import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card, Progress } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h1" color={colors.text.primary}>
            Profil
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Deine Statistiken und Erfolge
          </Text>
        </View>

        <Card variant="elevated" style={styles.statsCard}>
          <Text variant="h3" color={colors.text.primary}>
            Level 1
          </Text>
          <View style={styles.progressSection}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Fortschritt: 0/100 XP
            </Text>
            <Progress value={0} max={100} color={colors.primary[500]} />
          </View>
        </Card>

        <Card variant="elevated" style={styles.placeholder}>
          <Text variant="h4" color={colors.text.primary}>
            Coming Soon
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Weitere Profil-Features werden schrittweise hinzugefügt.
          </Text>
        </Card>
      </ScrollView>
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
  statsCard: {
    gap: spacing[3],
  },
  progressSection: {
    gap: spacing[2],
  },
  placeholder: {
    gap: spacing[3],
    alignItems: 'center',
    padding: spacing[6],
  },
});
