import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card, Progress, Button } from '../../shared/ui';
import { spacing } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';
import { useDataSource } from '../../core/providers/DataSourceContext';
import { DataSourceMode } from '../../core/ports/datasource.port';
import { FeatureFlags, FeatureFlag } from '../../core/config/features.config';

export const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { mode, switchMode } = useDataSource();
  const [enabledFeatures] = useState(FeatureFlags.getEnabled());

  const handleModeSwitch = (newMode: DataSourceMode) => {
    switchMode(newMode);
  };

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

        <Card variant="elevated" style={styles.statsCard}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            DataSource Modus
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.description}>
            Aktueller Modus: {mode}
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              variant={mode === DataSourceMode.SEED ? 'primary' : 'outline'}
              onPress={() => handleModeSwitch(DataSourceMode.SEED)}
              fullWidth
            >
              Seed
            </Button>
            <Button
              variant={mode === DataSourceMode.MOCK ? 'primary' : 'outline'}
              onPress={() => handleModeSwitch(DataSourceMode.MOCK)}
              fullWidth
            >
              Mock
            </Button>
            <Button
              variant={mode === DataSourceMode.LIVE ? 'primary' : 'outline'}
              onPress={() => handleModeSwitch(DataSourceMode.LIVE)}
              fullWidth
            >
              Live
            </Button>
          </View>
        </Card>

        <Card variant="elevated" style={styles.statsCard}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            Feature Flags
          </Text>
          <View style={styles.featuresGrid}>
            {Object.values(FeatureFlag).map((flag) => {
              const isEnabled = enabledFeatures.includes(flag);
              return (
                <View key={flag} style={styles.featureItem}>
                  <Text
                    variant="body"
                    color={
                      isEnabled ? colors.success[500] : colors.text.tertiary
                    }
                  >
                    {flag}: {isEnabled ? '✓' : '✗'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card variant="elevated" style={styles.statsCard}>
          <Text variant="h3" color={colors.text.primary} style={styles.sectionTitle}>
            System Info
          </Text>
          <View style={styles.infoGrid}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              App Version: 1.0.0
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Build: Development
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Platform: React Native + Expo
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
  statsCard: {
    gap: spacing[3],
  },
  progressSection: {
    gap: spacing[2],
  },
  sectionTitle: {
    marginBottom: spacing[2],
  },
  description: {
    marginBottom: spacing[2],
  },
  buttonGroup: {
    gap: spacing[3],
  },
  featuresGrid: {
    gap: spacing[2],
  },
  featureItem: {
    paddingVertical: spacing[1],
  },
  infoGrid: {
    gap: spacing[2],
  },
});
