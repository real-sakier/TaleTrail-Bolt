import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';
import { spacing, radius, elevation } from '../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  style,
  accessibilityRole = 'button',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          {leftIcon}
          <Text
            variant="button"
            style={[
              styles.text,
              variant === 'outline' && styles.textOutline,
              variant === 'ghost' && styles.textGhost,
            ]}
          >
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: spacing[2],
    ...elevation.sm,
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: '#FF9800',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: '#2196F3',
  },
  textGhost: {
    color: '#2196F3',
  },
});
