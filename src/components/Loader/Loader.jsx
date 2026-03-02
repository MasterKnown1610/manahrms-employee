import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const LOGO = require('../../assets/logo.png');

const SIZES = {
  small: 24,
  large: 48,
};

function Loader({ size = 'large', style }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dimension = SIZES[size] ?? SIZES.large;

  return (
    <View style={[styles.wrap, style]} pointerEvents="none">
      <Animated.View
        style={[
          styles.rotating,
          {
            width: dimension,
            height: dimension,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Image
          source={LOGO}
          style={[styles.logo, { width: dimension, height: dimension }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotating: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: 'transparent',
  },
});

export default Loader;
