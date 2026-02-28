import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';
import Context from '../../context/Context';

const CHAT_THEME_STORAGE_KEY = '@manahrms_chat_theme';

const CHAT_THEME_LIGHT = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0D8EC',
  text: '#2D2D2D',
  textSecondary: '#6B6B6B',
  placeholder: '#9E9E9E',
  inputBg: '#F8F6FC',
  bubbleUser: '#E8E0F4',
  bubbleAssistant: '#F5F5F5',
  avatarBg: '#E8E0F4',
  accent: colors.primary,
};

const CHAT_THEME_DARK = {
  background: '#212121',
  surface: '#2D2D2D',
  border: '#404040',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  placeholder: '#808080',
  inputBg: '#404040',
  bubbleUser: '#3A3A3A',
  bubbleAssistant: '#2D2D2D',
  avatarBg: '#3A3A3A',
  accent: '#B39DDB',
};

const DEFAULT_PROMPTS_LIGHT = [
  { id: 'leave-balance', label: 'My leave balance', icon: 'event', color: colors.success },
  { id: 'apply-leave', label: 'Apply for leave', icon: 'event-available', color: colors.primary },
  { id: 'attendance-help', label: 'Attendance help', icon: 'fingerprint', color: colors.priorityMedium },
  { id: 'hr-policies', label: 'HR policies', icon: 'description', color: colors.textSecondary },
];

const DEFAULT_PROMPTS_DARK = [
  { id: 'leave-balance', label: 'My leave balance', icon: 'event', color: '#81C784' },
  { id: 'apply-leave', label: 'Apply for leave', icon: 'event-available', color: '#64B5F6' },
  { id: 'attendance-help', label: 'Attendance help', icon: 'fingerprint', color: '#FFB74D' },
  { id: 'hr-policies', label: 'HR policies', icon: 'description', color: '#B0B0B0' },
];

const EMPTY_LOGO_SIZE = 96;
const LOADER_AVATAR_SIZE = 32;

function AIChatScreen({ navigation }) {
  const { aiChat } = useContext(Context);
  const { messages, loading, ask, clearMessages } = aiChat;
  const [inputText, setInputText] = useState('');
  const [chatTheme, setChatTheme] = useState('light');
  const listRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const headerLogoSpin = useRef(new Animated.Value(0)).current;

  // Logo fly-to-loader animation (empty state -> loader when first message is sent)
  const isInitialLoad = loading && messages.length === 1;
  const [loaderTarget, setLoaderTarget] = useState(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const loaderAvatarRef = useRef(null);
  const logoOverlayRef = useRef(null);

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(headerLogoSpin, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, [headerLogoSpin]);

  const headerLogoRotation = headerLogoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(CHAT_THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') setChatTheme(saved);
      } catch {
        // keep default 'light'
      }
    };
    loadTheme();
  }, []);

  const toggleChatTheme = async () => {
    const next = chatTheme === 'light' ? 'dark' : 'light';
    setChatTheme(next);
    try {
      await AsyncStorage.setItem(CHAT_THEME_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const theme = chatTheme === 'dark' ? CHAT_THEME_DARK : CHAT_THEME_LIGHT;
  const defaultPrompts = chatTheme === 'dark' ? DEFAULT_PROMPTS_DARK : DEFAULT_PROMPTS_LIGHT;
  const chatStyles = useMemo(() => createChatStyles(theme), [theme]);

  useEffect(() => {
    if (!loading) {
      spinValue.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [loading, spinValue]);

  // Reset logo animation state when starting a new chat
  useEffect(() => {
    if (messages.length === 0) {
      setInitialAnimationDone(false);
      setLoaderTarget(null);
      logoScale.setValue(1);
      logoTranslateX.setValue(0);
      logoTranslateY.setValue(0);
      logoOpacity.setValue(1);
    }
  }, [messages.length, logoScale, logoTranslateX, logoTranslateY, logoOpacity]);

  // Measure loader position when initial load starts (list footer has mounted)
  useEffect(() => {
    if (!isInitialLoad || initialAnimationDone) return;
    const id = setTimeout(() => {
      loaderAvatarRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0 && h > 0) setLoaderTarget({ x: x + w / 2, y: y + h / 2 });
      });
    }, 100);
    return () => clearTimeout(id);
  }, [isInitialLoad, initialAnimationDone]);

  // Run logo fly-to-loader animation when we have target (measure logo position so it lands exactly on loader)
  useEffect(() => {
    if (!loaderTarget || !isInitialLoad || initialAnimationDone) return;

    const scaleTo = LOADER_AVATAR_SIZE / EMPTY_LOGO_SIZE;

    const measureAndAnimate = () => {
      logoOverlayRef.current?.measureInWindow((x, y, w, h) => {
        const logoCenterX = x + w / 2;
        const logoCenterY = y + h / 2;
        const translateXTo = loaderTarget.x - logoCenterX;
        const translateYTo = loaderTarget.y - logoCenterY;

        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: scaleTo,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateX, {
            toValue: translateXTo,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateY, {
            toValue: translateYTo,
            duration: 450,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start(() => setInitialAnimationDone(true));
        });
      });
    };

    const id = requestAnimationFrame(() => {
      setTimeout(measureAndAnimate, 50);
    });
    return () => cancelAnimationFrame(id);
  }, [loaderTarget, isInitialLoad, initialAnimationDone, logoScale, logoTranslateX, logoTranslateY, logoOpacity]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleBackPress = () => {
    navigation.goBack?.();
  };

  const handleNewChat = () => {
    clearMessages();
  };

  const sendMessage = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;
    setInputText('');
    await ask(trimmed);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const onPromptPress = (prompt) => {
    sendMessage(prompt.label);
  };

  const renderMessage = ({ item }) => (
    <View style={[chatStyles.messageRow, item.role === 'user' ? chatStyles.messageRowUser : chatStyles.messageRowAssistant]}>
      {item.role === 'assistant' && (
        <View style={chatStyles.avatar}>
          <Image source={require('../../assets/logo.png')} style={chatStyles.avatarImage} resizeMode="contain" />
        </View>
      )}
      <View style={[chatStyles.bubble, item.role === 'user' ? chatStyles.bubbleUser : chatStyles.bubbleAssistant]}>
        <Text style={chatStyles.bubbleText}>{item.text}</Text>
      </View>
    </View>
  );

  const showEmptyState = messages.length === 0;

  return (
    <SafeAreaView style={chatStyles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={chatStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header: back (left) | AI Chat (center) | theme + new chat (right) */}
        <View style={chatStyles.header}>
          <Pressable onPress={handleBackPress} style={chatStyles.headerIcon} hitSlop={8}>
            <Icon name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <View style={chatStyles.headerCenter}>
            <View style={chatStyles.titlePill}>
              <Animated.View style={[chatStyles.headerLogoWrap, { transform: [{ rotate: headerLogoRotation }] }]}>
                <Image source={require('../../assets/logo.png')} style={chatStyles.headerLogo} resizeMode="contain" />
              </Animated.View>
              <Text style={chatStyles.titleText}>AI Chat</Text>
            </View>
          </View>
          <View style={chatStyles.headerRight}>
            <Pressable onPress={toggleChatTheme} style={chatStyles.themeToggle} hitSlop={8}>
              <Icon
                name={chatTheme === 'light' ? 'dark-mode' : 'light-mode'}
                size={22}
                color={theme.text}
              />
            </Pressable>
            <Pressable onPress={handleNewChat} style={chatStyles.headerIcon} hitSlop={8}>
              <Icon name="add-comment" size={24} color={theme.text} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        {showEmptyState ? (
          <ScrollView
            style={chatStyles.content}
            contentContainerStyle={chatStyles.emptyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={chatStyles.emptyStateLogoWrap}>
              <Image source={require('../../assets/logo.png')} style={chatStyles.emptyStateLogo} resizeMode="contain" />
            </View>
            <Text style={chatStyles.helpTitle}>What can I help with?</Text>
            <View style={chatStyles.promptsGrid}>
              {defaultPrompts.map((prompt) => (
                <Pressable
                  key={prompt.id}
                  style={chatStyles.promptPill}
                  onPress={() => onPromptPress(prompt)}
                >
                  <Icon name={prompt.icon} size={22} color={prompt.color} />
                  <Text style={chatStyles.promptLabel}>{prompt.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={chatStyles.messageList}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              ListFooterComponent={
                loading ? (
                  <View
                    style={[
                      chatStyles.messageRow,
                      chatStyles.messageRowAssistant,
                      isInitialLoad && !initialAnimationDone && chatStyles.loaderHidden,
                    ]}
                  >
                    <View ref={loaderAvatarRef} collapsable={false} style={chatStyles.avatarMeasureWrap}>
                      <Animated.View style={[chatStyles.avatar, { transform: [{ rotate: spin }] }]}>
                        <Image source={require('../../assets/logo.png')} style={chatStyles.avatarImage} resizeMode="contain" />
                      </Animated.View>
                    </View>
                    <View style={[chatStyles.bubble, chatStyles.bubbleAssistant, chatStyles.typingBubble]}>
                      <Text style={chatStyles.typingText}>Thinking...</Text>
                    </View>
                  </View>
                ) : null
              }
            />
            {/* Overlay: logo flies from center to loader when first message is sent */}
            {isInitialLoad && !initialAnimationDone && (
              <View style={chatStyles.logoOverlay} pointerEvents="none">
                <View ref={logoOverlayRef} collapsable={false} style={chatStyles.logoOverlayCenter}>
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        transform: [
                          { translateX: logoTranslateX },
                          { translateY: logoTranslateY },
                          { scale: logoScale },
                        ],
                        opacity: logoOpacity,
                      },
                    ]}
                  >
                    <Image source={require('../../assets/logo.png')} style={chatStyles.logoOverlayImage} resizeMode="contain" />
                  </Animated.View>
                </View>
              </View>
            )}
          </>
        )}

        {/* Input bar: icon inside the input container, safe area applied via SafeAreaView */}
        <View style={chatStyles.inputRow}>
          <View style={chatStyles.inputContainer}>
            <TextInput
              style={chatStyles.input}
              placeholder="Ask AI"
              placeholderTextColor={theme.placeholder}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => sendMessage(inputText)}
              returnKeyType="send"
              multiline
              maxLength={2000}
              editable={!loading}
            />
            {loading ? (
              <View style={chatStyles.inputIconInside} pointerEvents="none">
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : (
              <Pressable style={chatStyles.inputIconInside} onPress={() => sendMessage(inputText)}>
                <Icon name="send" size={24} color={theme.accent} />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createChatStyles(theme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerIcon: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerRight: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.xs,
    },
    titlePill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.xs,
    },
    headerLogoWrap: {
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerLogo: {
      width: 22,
      height: 22,
    },
    themeToggle: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
    },
    content: {
      flex: 1,
    },
    emptyContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateLogoWrap: {
      marginBottom: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateLogo: {
      width: 96,
      height: 96,
    },
    helpTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.text,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    promptsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: spacing.md,
      width: 320,
    },
    promptPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      gap: spacing.sm,
      width: 152,
      minHeight: 44,
    },
    promptLabel: {
      fontSize: 15,
      color: theme.text,
      fontWeight: '500',
    },
    messageList: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: spacing.md,
      alignItems: 'flex-start',
    },
    messageRowUser: {
      justifyContent: 'flex-end',
    },
    messageRowAssistant: {
      justifyContent: 'flex-start',
    },
    loaderHidden: {
      opacity: 0,
    },
    avatarMeasureWrap: {
      alignSelf: 'flex-start',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.avatarBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
      marginTop: 2,
      overflow: 'hidden',
    },
    avatarImage: {
      width: 20,
      height: 20,
    },
    logoOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoOverlayCenter: {
      width: EMPTY_LOGO_SIZE,
      height: EMPTY_LOGO_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoOverlayImage: {
      width: EMPTY_LOGO_SIZE,
      height: EMPTY_LOGO_SIZE,
    },
    bubble: {
      maxWidth: '80%',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
    },
    bubbleUser: {
      backgroundColor: theme.bubbleUser,
      borderWidth: 1,
      borderColor: theme.border,
    },
    bubbleAssistant: {
      backgroundColor: theme.bubbleAssistant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    typingText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    bubbleText: {
      fontSize: 15,
      color: theme.text,
      lineHeight: 22,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: theme.inputBg,
      borderRadius: borderRadius.full,
      paddingLeft: spacing.md,
      paddingVertical: spacing.xs,
      paddingRight: spacing.xs,
    },
    input: {
      flex: 1,
      minHeight: 36,
      maxHeight: 100,
      paddingVertical: spacing.sm,
      paddingRight: spacing.sm,
      fontSize: 16,
      color: theme.text,
    },
    inputIconInside: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}

export default AIChatScreen;
