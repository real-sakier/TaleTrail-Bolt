import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Card, Badge, Progress } from '../../shared/ui';
import { spacing, rarityConfig } from '../../shared/tokens';
import { useTheme } from '../../shared/theme';
import { RarityLevel } from '../../shared/tokens/rarity';

export const CardDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const rarity: RarityLevel = 'legendary';
  const rarityData = rarityConfig[rarity];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Card
          variant="elevated"
          style={[
            styles.cardPreview,
            {
              borderColor: rarityData.borderColor.light,
              backgroundColor: rarityData.backgroundColor.light,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Badge rarity={rarity} label={rarityData.label} />
            <Text variant="h2" color={colors.text.primary}>
              Brandenburger Tor
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <View
              style={[styles.imagePlaceholder, { backgroundColor: colors.neutral[200] }]}
            >
              <Text variant="body" color={colors.text.secondary}>
                Image Placeholder
              </Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text variant="caption" color={colors.text.secondary}>
                Buff Type
              </Text>
              <Text variant="bodyLarge" color={colors.text.primary}>
                City XP +{rarityData.label === 'Legendary' ? '25%' : '20%'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" color={colors.text.secondary}>
                Duration
              </Text>
              <Text variant="bodyLarge" color={colors.text.primary}>
                90 min
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="caption" color={colors.text.secondary}>
                Cooldown
              </Text>
              <Text variant="bodyLarge" color={colors.text.primary}>
                180 min
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary}>
            Description
          </Text>
          <Text variant="body" color={colors.text.secondary}>
            Das Brandenburger Tor ist ein klassizistisches Triumphtor in Berlin. Es wurde
            in den Jahren von 1789 bis 1793 auf Anweisung des preußischen Königs Friedrich
            Wilhelm II. errichtet und ist das bekannteste Wahrzeichen der Stadt.
          </Text>
        </Card>

        <Card variant="elevated" style={styles.section}>
          <Text variant="h3" color={colors.text.primary}>
            Collection Progress
          </Text>
          <View style={styles.progressContainer}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              Berlin Cards: 12/50
            </Text>
            <Progress value={12} max={50} color={rarityData.color.light} />
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button variant="primary" fullWidth>
            Activate Buff
          </Button>
          <Button variant="outline" fullWidth>
            View on Map
          </Button>
        </View>
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
  cardPreview: {
    gap: spacing[4],
    borderWidth: 3,
  },
  cardHeader: {
    gap: spacing[2],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: spacing[2],
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing[3],
  },
  statItem: {
    flex: 1,
    gap: spacing[1],
    alignItems: 'center',
  },
  section: {
    gap: spacing[3],
  },
  progressContainer: {
    gap: spacing[2],
  },
  actionButtons: {
    gap: spacing[3],
  },
});
