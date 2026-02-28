import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon/Icon';
import { borderRadius, colors, spacing } from '../../theme/theme';

const ToastContext = createContext({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const TYPE_META = {
  success: { icon: 'check-circle', accent: colors.success, title: 'Success' },
  error: { icon: 'error-outline', accent: colors.error, title: 'Error' },
  warning: { icon: 'warning-amber', accent: '#FF8F00', title: 'Warning' },
  info: { icon: 'info-outline', accent: colors.primary, title: 'Info' },
};

function ToastView({ toast, onClose, topOffset }) {
  const meta = TYPE_META[toast.type] ?? TYPE_META.info;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          top: topOffset,
          opacity: toast.anim.opacity,
          transform: [{ translateY: toast.anim.translateY }],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={[styles.accent, { backgroundColor: meta.accent }]} />
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: `${meta.accent}1A` }]}>
              <Icon name={meta.icon} size={22} color={meta.accent} />
            </View>
            <View style={styles.textWrap}>
              <Text numberOfLines={1} style={styles.title}>
                {toast.title || meta.title}
              </Text>
              <Text style={styles.message}>{toast.message}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Icon name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const timerRef = useRef(null);
  const [toast, setToast] = useState(null);

  const hide = useCallback(() => {
    if (!toast) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;

    Animated.parallel([
      Animated.timing(toast.anim.opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(toast.anim.translateY, { toValue: -12, duration: 140, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [toast]);

  const showToast = useCallback(
    ({ type = 'info', title = '', message = '', duration = 2600 } = {}) => {
      if (!message) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;

      const anim = {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(-12),
      };

      setToast({ type, title, message, duration, anim });

      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(anim.translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();

      timerRef.current = setTimeout(() => hide(), duration);
    },
    [hide],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <ToastView toast={toast} onClose={hide} topOffset={insets.top + spacing.md} />
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapper: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  content: {
    padding: spacing.md,
    paddingLeft: spacing.md + 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  closeBtn: {
    paddingTop: 2,
  },
});

export default ToastProvider;
