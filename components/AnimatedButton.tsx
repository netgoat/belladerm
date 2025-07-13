import React, { useRef } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  activeOpacity?: number;
  scaleValue?: number;
}

export default function AnimatedButton({
  children,
  onPress,
  style,
  activeOpacity = 0.8,
  scaleValue = 0.95,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}