import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';

export const QuestsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h1" color={colors.text.primary}>
            Quests
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Deine aktiven und verfügbaren Quests
          </Text>
        </View>

        <Card variant="elevated" style={styles.placeholder}>
          <Text variant="h3" color={colors.text.primary}>
            Coming Soon
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Quest-System wird in Phase 4 implementiert.
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
  placeholder: {
    gap: spacing[3],
    alignItems: 'center',
    padding: spacing[6],
  },
});
