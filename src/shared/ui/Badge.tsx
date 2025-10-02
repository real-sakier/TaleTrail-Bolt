import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, radius } from '../tokens';
import { RarityLevel, rarityConfig } from '../tokens/rarity';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  rarity?: RarityLevel;
  label: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  rarity,
  label,
  size = 'md',
  style,
  ...rest
}) => {
  const rarityColors = rarity ? rarityConfig[rarity] : null;

  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[size],
        rarity && {
          backgroundColor: rarityColors?.backgroundColor.light,
          borderColor: rarityColors?.borderColor.light,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        variant={size === 'sm' ? 'caption' : 'bodySmall'}
        style={[styles.text, rarity && { color: rarityColors?.color.light }]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  default: {
    backgroundColor: '#E0E0E0',
  },
  success: {
    backgroundColor: '#C8E6C9',
  },
  warning: {
    backgroundColor: '#FFE082',
  },
  error: {
    backgroundColor: '#FFCDD2',
  },
  sm: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  md: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  text: {
    color: '#212121',
  },
});
