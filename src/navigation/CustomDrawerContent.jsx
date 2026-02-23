import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon/Icon';
import { colors, spacing, borderRadius } from '../theme/theme';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'Attendance', label: 'Attendance', icon: 'event' },
  { key: 'Tasks', label: 'Tasks', icon: 'assignment' },
  { key: 'Leaves', label: 'Leaves', icon: 'description' },
  { key: 'Employee', label: 'Employee', icon: 'people' },
  { key: 'Department', label: 'Department', icon: 'business' },
  { key: 'Projects', label: 'Projects', icon: 'send' },
  { key: 'Reports', label: 'Reports', icon: 'bar-chart' },
  { key: 'Calendar', label: 'Calendar', icon: 'calendar-today' },
  { key: 'Messaging', label: 'Messaging', icon: 'mail', showBadge: true },
  { key: 'Settings', label: 'Settings', icon: 'settings' },
];

const BOTTOM_TABS = [
  { key: 'Home', label: 'Home', icon: 'home' },
  { key: 'Tasks', label: 'Tasks', icon: 'assignment' },
  { key: 'Calendar', label: 'Calendar', icon: 'event' },
  { key: 'Chat', label: 'Chat', icon: 'chat' },
  { key: 'Profile', label: 'Profile', icon: 'person' },
];

function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const insets = useSafeAreaInsets();

  const nestedState = state?.routes?.[state.index]?.state;
  const activeScreen = nestedState?.routes?.[nestedState.index]?.name ?? 'Dashboard';
  const activeBottomTab = activeScreen === 'Profile' ? 'Profile' : 'Home';

  const navigateTo = (screenKey) => {
    navigation.closeDrawer();
    if (['Dashboard', 'Profile', 'Attendance', 'Tasks', 'Leaves'].includes(screenKey)) {
      const screenName = screenKey === 'Leaves' ? 'Leave' : screenKey;
      navigation.navigate('Main', { screen: screenName });
    } else {
      navigation.navigate('Main', { screen: 'Dashboard' });
    }
  };

  const navigateBottomTab = (tabKey) => {
    navigation.closeDrawer();
    if (tabKey === 'Profile') {
      navigation.navigate('Main', { screen: 'Profile' });
    } else {
      navigation.navigate('Main', { screen: 'Dashboard' });
    }
  };

  return (
    <View style={[styles.container, { width: DRAWER_WIDTH }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: spacing.lg + insets.top,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Brand */}
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandName}>ManaHRMS</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={28} color={colors.textSecondary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Kisa Rivera</Text>
            <Text style={styles.userRole}>HR Manager</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => {
            const isActive = activeScreen === item.key || (item.key === 'Leaves' && activeScreen === 'Leave');
            return (
              <Pressable
                key={item.key}
                onPress={() => navigateTo(item.key)}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={isActive ? colors.background : colors.text}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    isActive && styles.menuLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                {item.showBadge ? <View style={styles.menuBadge} /> : null}
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  userRole: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menu: {
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: colors.primary,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  menuLabelActive: {
    color: colors.background,
    fontWeight: '600',
  },
  menuBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  bottomTabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  bottomTabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
