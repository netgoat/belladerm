import React, { useRef, useEffect } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface PulseAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export default function PulseAnimation({
  children,
  style,
  duration = 1000,
  minScale = 1,
  maxScale = 1.05,
}: PulseAnimationProps) {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: minScale,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [duration, minScale, maxScale]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}>
      {children}
    </Animated.View>
  );
}