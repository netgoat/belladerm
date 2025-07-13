import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, TextStyle } from 'react-native';

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: TextStyle;
}

export default function AnimatedCounter({
  endValue,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  style,
}: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayText, setDisplayText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      const formattedValue = decimals > 0 
        ? value.toFixed(decimals)
        : Math.floor(value).toString();
      setDisplayText(`${prefix}${formattedValue}${suffix}`);
    });

    Animated.timing(animatedValue, {
      toValue: endValue,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [endValue, duration, decimals, suffix, prefix]);

  return (
    <Text style={style}>
      {displayText}
    </Text>
  );
}