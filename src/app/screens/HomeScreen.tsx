import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Card, Badge, Progress } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';

export const HomeScreen: React.FC = () => {
  const { colors, toggleColorScheme, colorScheme } = useTheme();

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
});
