import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import { spacing, radius, elevation } from '../tokens';

type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  onPress?: PressableProps['onPress'];
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 4,
  onPress,
  style,
  children,
  ...rest
}) => {
  const content = (
    <View
      style={[styles.base, styles[variant], { padding: spacing[padding] }, style]}
      {...rest}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
  },
  default: {
    ...elevation.sm,
  },
  elevated: {
    ...elevation.lg,
  },
  outlined: {
    ...elevation.none,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pressed: {
    opacity: 0.8,
  },
});
