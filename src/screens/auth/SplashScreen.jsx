import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { Icon } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../theme/theme';

const SPLASH_DURATION_MS = 3000;
const LOGO_SIZE = 120;

function SplashScreen() {
  const { setLoading } = useAuth();
  const [progress, setProgress] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const intervalMs = SPLASH_DURATION_MS / 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, intervalMs);

    const doneTimer = setTimeout(() => {
      setLoading(false);
    }, SPLASH_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(doneTimer);
    };
  }, [setLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topContent}>
          <Animated.View style={[styles.logoRing, { transform: [{ rotate: spin }] }]}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.appName}>ManaHRMS</Text>
          <Text style={styles.tagline}>ENTERPRISE SOLUTIONS</Text>
        </View>

        <View style={styles.loaderSection}>
          <View style={styles.loaderHeader}>
            <Text style={styles.loaderLabel}>INITIALIZING SYSTEM</Text>
            <Text style={styles.loaderPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <View style={styles.secureRow}>
            <Icon name="lock" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={styles.secureText}> SECURE CONNECTION ESTABLISHED</Text>
          </View>
          <Text style={styles.version}>Version 2.4.0 © 2024 ManaHRMS Inc.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B4E',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 80,
  },
  topContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRing: {
    width: LOGO_SIZE + 16,
    height: LOGO_SIZE + 16,
    borderRadius: (LOGO_SIZE + 16) / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.2,
    marginBottom: spacing.xxl,
  },
  loaderSection: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  loaderHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  loaderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  loaderPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F5A623',
    borderRadius: 3,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  secureText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: spacing.xs,
  },
  version: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});

export default SplashScreen;
