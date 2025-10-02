import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { textStyles, typography } from '../tokens';

type TextVariant = keyof typeof textStyles;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}) => {
  const variantStyle = textStyles[variant];

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        color && { color },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
  },
});
