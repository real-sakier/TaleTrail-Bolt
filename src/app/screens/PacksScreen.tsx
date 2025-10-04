import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';

export const PacksScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h1" color={colors.text.primary}>
            Packs
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Öffne Packs und sammle Karten
          </Text>
        </View>

        <Card variant="elevated" style={styles.placeholder}>
          <Text variant="h3" color={colors.text.primary}>
            Coming Soon
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Pack-System wird in Phase 5 implementiert.
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
