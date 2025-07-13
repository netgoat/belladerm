import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from 'react-native';

interface AnimatedInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  focusedLabelStyle?: any;
  focusedContainerStyle?: any;
}

export default function AnimatedInput({
  label,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  focusedLabelStyle,
  focusedContainerStyle,
  ...textInputProps
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLabelPress = () => {
    inputRef.current?.focus();
  };

  const labelTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const labelScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(127, 140, 141, 0.7)', '#D4AF37'],
  });

  return (
    <View style={[
      styles.container,
      containerStyle,
      isFocused && focusedContainerStyle,
    ]}>
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={styles.labelContainer}
            onPress={handleLabelPress}
            activeOpacity={1}>
            <Animated.Text
              style={[
                styles.label,
                labelStyle,
                isFocused && focusedLabelStyle,
                {
                  transform: [
                    { translateY: labelTranslateY },
                    { scale: labelScale },
                  ],
                  color: labelColor,
                },
              ]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            textAlign="right"
            {...textInputProps}
          />
        </View>

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    maxWidth: Platform.OS === 'web' ? 350 : '100%',
    alignSelf: 'center',
    width: '100%',
    minHeight: 55,
    position: 'relative',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 14,
    color: '#2C3E50',
    paddingVertical: 12,
    paddingHorizontal: 8,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});