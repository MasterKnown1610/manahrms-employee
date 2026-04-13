import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  Keyboard,
  Platform,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

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
  stopBtn: '#E57373',
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
  stopBtn: '#E57373',
};

const EMPTY_LOGO_SIZE = 96;
const LOADER_AVATAR_SIZE = 32;
const TYPING_INTERVAL_MS = 18;   // tick speed
const CHARS_PER_TICK = 3;        // chars revealed per tick (increase to type faster)
const CATCHUP_THRESHOLD = 80;    // if pending queue > this, type faster to catch up

// ─── Blinking cursor ─────────────────────────────────────────────────────────
function BlinkingCursor({ color }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 530, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 530, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.Text style={{ opacity, color, fontSize: 15, lineHeight: 22 }}>
      {'▋'}
    </Animated.Text>
  );
}

// ─── Thinking dots ────────────────────────────────────────────────────────────
function ThinkingDots({ color }) {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (val, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: 380, useNativeDriver: true }),
        ])
      );
    const a1 = pulse(d1, 0);
    const a2 = pulse(d2, 140);
    const a3 = pulse(d3, 280);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [d1, d2, d3]);

  const dot = (val) => (
    <Animated.View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color, marginHorizontal: 2, opacity: val }} />
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
      {dot(d1)}{dot(d2)}{dot(d3)}
    </View>
  );
}

// ─── Streaming message with typing animation ──────────────────────────────────
// Receives `fullText` (grows as chunks arrive) and types it out character by character.
function StreamingMessage({ fullText, isStreaming, bubbleStyle, textStyle, textSecondaryColor }) {
  const [displayedText, setDisplayedText] = useState('');

  // Use a ref-based state to avoid stale closures inside the interval
  const stateRef = useRef({ displayed: '', pending: '' });
  const timerRef = useRef(null);
  const isStreamingRef = useRef(isStreaming);
  isStreamingRef.current = isStreaming;

  // When fullText grows (new SSE chunk arrived), queue new characters
  useEffect(() => {
    const { displayed, pending } = stateRef.current;
    const alreadyQueued = displayed.length + pending.length;
    const newChars = fullText.slice(alreadyQueued);
    if (newChars) {
      stateRef.current.pending += newChars;
    }
  }, [fullText]);

  // Start the typing interval once on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (stateRef.current.pending.length === 0) return;

      // Type faster when the queue is large (server sent a lot at once)
      const count = stateRef.current.pending.length > CATCHUP_THRESHOLD
        ? CHARS_PER_TICK * 3
        : CHARS_PER_TICK;

      const chunk = stateRef.current.pending.slice(0, count);
      stateRef.current.pending = stateRef.current.pending.slice(count);
      stateRef.current.displayed += chunk;
      setDisplayedText(stateRef.current.displayed);
    }, TYPING_INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, []);

  // When streaming finishes, flush any remaining queued text immediately
  useEffect(() => {
    if (!isStreaming && fullText) {
      // Give the typing interval ~600ms to drain naturally, then force-flush
      const flushId = setTimeout(() => {
        if (stateRef.current.pending.length > 0) {
          stateRef.current.displayed = fullText;
          stateRef.current.pending = '';
          setDisplayedText(fullText);
        }
      }, 600);
      return () => clearTimeout(flushId);
    }
  }, [isStreaming, fullText]);

  const showDots = !displayedText && isStreaming;
  const showCursor = isStreaming || displayedText.length < fullText.length;

  return (
    <View style={bubbleStyle}>
      {showDots ? (
        <ThinkingDots color={textSecondaryColor} />
      ) : (
        <Text style={textStyle}>
          {displayedText}
          {showCursor ? <BlinkingCursor color={textSecondaryColor} /> : null}
        </Text>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
function AIChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { aiChat } = useContext(Context);
  const { messages, loading, streaming, ask, stop, clearMessages } = aiChat;

  const [inputText, setInputText] = useState('');
  const listRef = useRef(null);
  const headerLogoSpin = useRef(new Animated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const isBusy = loading || streaming;

  // Logo fly-to-loader animation
  const isInitialLoad = loading && messages.length === 1;
  const [loaderTarget, setLoaderTarget] = useState(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const loaderAvatarRef = useRef(null);
  const logoOverlayRef = useRef(null);

  const theme = useMemo(
    () => ({ ...(isDark ? CHAT_THEME_DARK : CHAT_THEME_LIGHT), accent: colors.primary }),
    [isDark, colors.primary]
  );
  const chatStyles = useMemo(() => createChatStyles(theme), [theme]);

  const defaultPrompts = useMemo(
    () => [
      { id: 'leave-balance', label: 'My leave balance', icon: 'event', color: colors.success },
      { id: 'apply-leave', label: 'Apply for leave', icon: 'event-available', color: colors.primary },
      { id: 'attendance-help', label: 'Attendance help', icon: 'fingerprint', color: colors.priorityMedium },
      { id: 'hr-policies', label: 'HR policies', icon: 'description', color: colors.textSecondary },
    ],
    [colors]
  );

  // Keyboard height
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s1 = Keyboard.addListener(showEvt, (e) => setKeyboardHeight(e.endCoordinates.height));
    const s2 = Keyboard.addListener(hideEvt, () => setKeyboardHeight(0));
    return () => { s1.remove(); s2.remove(); };
  }, []);

  // Header logo spin
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(headerLogoSpin, { toValue: 1, duration: 3000, useNativeDriver: true })
    );
    anim.start();
    return () => anim.stop();
  }, [headerLogoSpin]);

  const headerLogoRotation = headerLogoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Reset logo animation on clear
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

  // Measure loader avatar for fly animation
  useEffect(() => {
    if (!isInitialLoad || initialAnimationDone) return;
    const id = setTimeout(() => {
      loaderAvatarRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0 && h > 0) setLoaderTarget({ x: x + w / 2, y: y + h / 2 });
      });
    }, 100);
    return () => clearTimeout(id);
  }, [isInitialLoad, initialAnimationDone]);

  // Run fly animation
  useEffect(() => {
    if (!loaderTarget || !isInitialLoad || initialAnimationDone) return;
    const scaleTo = LOADER_AVATAR_SIZE / EMPTY_LOGO_SIZE;
    const run = () => {
      logoOverlayRef.current?.measureInWindow((x, y, w, h) => {
        const cx = x + w / 2, cy = y + h / 2;
        Animated.parallel([
          Animated.timing(logoScale, { toValue: scaleTo, duration: 450, useNativeDriver: true }),
          Animated.timing(logoTranslateX, { toValue: loaderTarget.x - cx, duration: 450, useNativeDriver: true }),
          Animated.timing(logoTranslateY, { toValue: loaderTarget.y - cy, duration: 450, useNativeDriver: true }),
        ]).start(() => {
          Animated.timing(logoOpacity, { toValue: 0, duration: 150, useNativeDriver: true })
            .start(() => setInitialAnimationDone(true));
        });
      });
    };
    const id = requestAnimationFrame(() => setTimeout(run, 50));
    return () => cancelAnimationFrame(id);
  }, [loaderTarget, isInitialLoad, initialAnimationDone, logoScale, logoTranslateX, logoTranslateY, logoOpacity]);

  const sendMessage = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isBusy) return;
    setInputText('');
    ask(trimmed);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // The last assistant message is the one being streamed
  const streamingMsgId =
    streaming && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant'
      ? messages[messages.length - 1].id
      : null;

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    const isStreamingMsg = item.id === streamingMsgId;

    return (
      <View style={[chatStyles.messageRow, isUser ? chatStyles.messageRowUser : chatStyles.messageRowAssistant]}>
        {!isUser && (
          <View style={chatStyles.avatar}>
            <Image source={require('../../assets/logo.png')} style={chatStyles.avatarImage} resizeMode="contain" />
          </View>
        )}

        {isStreamingMsg ? (
          // Typing animation for the active streaming message
          <StreamingMessage
            fullText={item.text}
            isStreaming={streaming}
            bubbleStyle={[chatStyles.bubble, chatStyles.bubbleAssistant]}
            textStyle={chatStyles.bubbleText}
            textSecondaryColor={theme.textSecondary}
          />
        ) : (
          // Completed / user messages — render normally
          <View style={[chatStyles.bubble, isUser ? chatStyles.bubbleUser : chatStyles.bubbleAssistant]}>
            <Text style={chatStyles.bubbleText}>{item.text}</Text>
          </View>
        )}
      </View>
    );
  };

  const showEmptyState = messages.length === 0;
  const statusBarBg = isDark ? theme.background : colors.primary;

  return (
    <View style={chatStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={statusBarBg} />
      {insets.top > 0 && (
        <View style={[chatStyles.statusBarFill, { height: insets.top, backgroundColor: statusBarBg }]} />
      )}
      <View style={chatStyles.safeAreaInner}>
        <View style={[chatStyles.flex, { paddingBottom: keyboardHeight }]}>

          {/* Header */}
          <View style={chatStyles.header}>
            <View style={chatStyles.headerLeft}>
              <Pressable onPress={() => navigation.goBack?.()} style={chatStyles.headerIcon} hitSlop={8}>
                <Icon name="arrow-back" size={24} color={theme.text} />
              </Pressable>
              <View style={chatStyles.titlePill}>
                <Animated.View style={[chatStyles.headerLogoWrap, { transform: [{ rotate: headerLogoRotation }] }]}>
                  <Image source={require('../../assets/logo.png')} style={chatStyles.headerLogo} resizeMode="contain" />
                </Animated.View>
                <Text style={chatStyles.titleText}>AI Chat</Text>
              </View>
            </View>
            <View style={chatStyles.headerRight}>
              <Pressable onPress={toggleTheme} style={chatStyles.themeToggle} hitSlop={8}>
                <Icon name={isDark ? 'light-mode' : 'dark-mode'} size={22} color={theme.text} />
              </Pressable>
              <Pressable onPress={clearMessages} style={chatStyles.headerIcon} hitSlop={8}>
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
                  <Pressable key={prompt.id} style={chatStyles.promptPill} onPress={() => sendMessage(prompt.label)}>
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
                // Show "Thinking..." footer only while waiting for the very first chunk
                // (loading=true, streaming=false). Once streaming starts, the message
                // bubble itself handles animation — no footer needed.
                ListFooterComponent={
                  loading && !streaming ? (
                    <View style={[
                      chatStyles.messageRow,
                      chatStyles.messageRowAssistant,
                      isInitialLoad && !initialAnimationDone && chatStyles.loaderHidden,
                    ]}>
                      <View ref={loaderAvatarRef} collapsable={false} style={chatStyles.avatarMeasureWrap}>
                        <View style={chatStyles.avatar}>
                          <Image source={require('../../assets/logo.png')} style={chatStyles.avatarImage} resizeMode="contain" />
                        </View>
                      </View>
                      <View style={[chatStyles.bubble, chatStyles.bubbleAssistant]}>
                        <ThinkingDots color={theme.textSecondary} />
                      </View>
                    </View>
                  ) : null
                }
              />

              {/* Logo fly-to-loader overlay */}
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

          {/* Input bar */}
          <View style={[chatStyles.inputRow, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
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
                editable={!isBusy}
              />

              {isBusy ? (
                <Pressable style={[chatStyles.actionBtn, { backgroundColor: theme.stopBtn }]} onPress={() => stop?.()}>
                  <View style={chatStyles.stopSquare} />
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    chatStyles.actionBtn,
                    { backgroundColor: theme.accent },
                    !inputText.trim() && chatStyles.actionBtnDisabled,
                  ]}
                  onPress={() => sendMessage(inputText)}
                  disabled={!inputText.trim()}
                >
                  <Icon name="arrow-upward" size={20} color="#fff" />
                </Pressable>
              )}
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

function createChatStyles(theme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1, backgroundColor: theme.background },
    statusBarFill: { width: '100%' },
    safeAreaInner: { flex: 1, backgroundColor: theme.background },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerIcon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.xs },
    headerRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs },
    titlePill: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md,
      borderRadius: borderRadius.full, borderWidth: 1, borderColor: theme.border, gap: spacing.xs,
    },
    headerLogoWrap: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
    headerLogo: { width: 22, height: 22 },
    themeToggle: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    titleText: { fontSize: 15, fontWeight: '600', color: theme.text },

    content: { flex: 1 },
    emptyContent: { flexGrow: 1, paddingHorizontal: spacing.lg, justifyContent: 'center', alignItems: 'center' },
    emptyStateLogoWrap: { marginBottom: spacing.lg, alignItems: 'center', justifyContent: 'center' },
    emptyStateLogo: { width: 96, height: 96 },
    helpTitle: { fontSize: 22, fontWeight: '600', color: theme.text, marginBottom: spacing.xl, textAlign: 'center' },
    promptsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignSelf: 'center', gap: spacing.md, width: 320 },
    promptPill: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.full, borderWidth: 1,
      borderColor: theme.border, backgroundColor: theme.surface,
      gap: spacing.sm, width: 152, minHeight: 44,
    },
    promptLabel: { fontSize: 15, color: theme.text, fontWeight: '500' },

    messageList: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    messageRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-start' },
    messageRowUser: { justifyContent: 'flex-end' },
    messageRowAssistant: { justifyContent: 'flex-start' },
    loaderHidden: { opacity: 0 },
    avatarMeasureWrap: { alignSelf: 'flex-start' },
    avatar: {
      width: 32, height: 32, borderRadius: 16,
      backgroundColor: theme.avatarBg,
      justifyContent: 'center', alignItems: 'center',
      marginRight: spacing.sm, marginTop: 2, overflow: 'hidden',
    },
    avatarImage: { width: 20, height: 20 },
    logoOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    logoOverlayCenter: { width: EMPTY_LOGO_SIZE, height: EMPTY_LOGO_SIZE, justifyContent: 'center', alignItems: 'center' },
    logoOverlayImage: { width: EMPTY_LOGO_SIZE, height: EMPTY_LOGO_SIZE },

    bubble: {
      maxWidth: '80%',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
    },
    bubbleUser: { backgroundColor: theme.bubbleUser, borderWidth: 1, borderColor: theme.border },
    bubbleAssistant: { backgroundColor: theme.bubbleAssistant, borderWidth: 1, borderColor: theme.border },
    bubbleText: { fontSize: 15, color: theme.text, lineHeight: 22 },

    inputRow: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    inputContainer: {
      flexDirection: 'row', alignItems: 'flex-end',
      backgroundColor: theme.inputBg,
      borderRadius: 24,
      paddingLeft: spacing.md, paddingVertical: spacing.xs, paddingRight: spacing.xs,
      minHeight: 52,
    },
    input: {
      flex: 1, minHeight: 36, maxHeight: 120,
      paddingVertical: spacing.sm, paddingRight: spacing.sm,
      fontSize: 16, color: theme.text,
    },
    actionBtn: {
      width: 40, height: 40, borderRadius: 20,
      justifyContent: 'center', alignItems: 'center',
      marginBottom: 2,
    },
    actionBtnDisabled: { opacity: 0.4 },
    stopSquare: { width: 14, height: 14, borderRadius: 3, backgroundColor: '#fff' },
  });
}

export default AIChatScreen;
