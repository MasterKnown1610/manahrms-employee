import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  EmailInput,
  PasswordInput,
  Button,
  Icon,
} from '../../components';
import { colors, spacing } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import Context from '../../context/Context';

const CARD_RADIUS = 24;
const LOGO_CIRCLE_SIZE = 64;

function LoginScreen({ navigation }) {
  const {
    login: { login },
  } = useContext(Context);
  const { login: setAuthenticated } = useAuth();
  const [orgCode, setOrgCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ text: '', type: null }); // type: 'success' | 'error'

  const handleLogin = async () => {
    setMessage({ text: '', type: null });
    try {
      const response = await login(email, password);
      console.log('response', response);
      const isSuccess = response?.status === 200;
      if (isSuccess) {
        const msg = response?.data?.message || 'Login successful';
        setMessage({ text: msg, type: 'success' });
        setAuthenticated(response?.data);
      } else {
        setMessage({ text: response?.data?.message || 'Login failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: err?.message || 'Login failed', type: 'error' });
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password
  };

  const handleLoginWithOTP = () => {
    // Navigate to OTP login
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
        {/* Header */}
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>ManaHRMS</Text>
        <Text style={styles.tagline}>Employee Portal Login</Text>

        {/* Status message - notification style */}
        {message.text ? (
          <View
            style={[
              styles.notification,
              message.type === 'error' ? styles.notificationError : styles.notificationSuccess,
            ]}
          >
            <Icon
              name={message.type === 'error' ? 'error' : 'check-circle'}
              size={20}
              color={message.type === 'error' ? '#b71c1c' : '#2e7d32'}
            />
            <Text
              style={[
                styles.notificationText,
                message.type === 'error' ? styles.notificationTextError : styles.notificationTextSuccess,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ) : null}

        {/* Form */}
        <EmailInput
          value={email}
          onChangeText={setEmail}
          leftIcon={<Icon name="person" />}
        />
        <PasswordInput value={password} onChangeText={setPassword} />

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe((prev) => !prev)}
            hitSlop={8}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe ? (
                <Icon name="check" size={16} color={colors.background} />
              ) : null}
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </Pressable>
          <Pressable onPress={handleForgotPassword} hitSlop={8}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Button
          title="Login"
          onPress={handleLogin}
          rightIcon={<Icon name="arrow-forward" size={22} color={colors.background} />}
          style={styles.loginButton}
        />

        {/* OR Divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* Login with OTP */}
        <Button
          title="Login with OTP"
          variant="secondary"
          onPress={handleLoginWithOTP}
          leftIcon={<Icon name="vpn-key" />}
        />

        {/* Footer */}
        <Text style={styles.poweredBy}>Powered by ManaHRMS</Text>
        <Text style={styles.version}>V1.0.0 • ENTERPRISE CLOUD</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E6EB',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#E8E6EB',
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: CARD_RADIUS,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoCircle: {
    width: LOGO_CIRCLE_SIZE,
    height: LOGO_CIRCLE_SIZE,
    borderRadius: LOGO_CIRCLE_SIZE / 2,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  logoImage: {
    width: LOGO_CIRCLE_SIZE - 20,
    height: LOGO_CIRCLE_SIZE - 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 14,
    color: colors.text,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notificationSuccess: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  notificationError: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#b71c1c',
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  notificationTextSuccess: {
    color: '#1b5e20',
  },
  notificationTextError: {
    color: '#b71c1c',
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  poweredBy: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: 11,
    color: colors.placeholder,
    textAlign: 'center',
  },
});

export default LoginScreen;
