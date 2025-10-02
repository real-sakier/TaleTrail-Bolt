import React from 'react';
import { View, ViewProps, StyleSheet, Animated } from 'react-native';

export interface ProgressProps extends ViewProps {
  value: number;
  max?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = '#2196F3',
  backgroundColor = '#E0E0E0',
  height = 8,
  style,
  ...rest
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedValue]);

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      {...rest}
    >
      <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              height,
              borderRadius: height / 2,
              width,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
