import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Card } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore, useUserProfileStore } from '../../store';
import { updateUserProfile } from '../../services/authService';
import { getErrorMessage } from '../../services/apiClient';

type ProfileSectionItem = {
  label: string;
  icon: string;
  value?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  color?: string;
};

type ProfileSection = {
  title: string;
  items: ProfileSectionItem[];
};

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const {
    goal,
    darkMode,
    notificationsEnabled,
    toggleDarkMode,
    setNotificationsEnabled,
    streak,
  } = useUserProfileStore();

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await updateUserProfile({ notificationsEnabled: value });
    } catch (err) {
      setNotificationsEnabled(!value); // revert
      Alert.alert('Error', getErrorMessage(err));
    }
  };

  const handleDarkModeToggle = async () => {
    toggleDarkMode();
    try {
      await updateUserProfile({ darkMode: !darkMode });
    } catch {
      toggleDarkMode(); // revert
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
    );
  };

  const sections: ProfileSection[] = [
    {
      title: '👤 Account',
      items: [
        { label: 'Name', icon: '📛', value: user?.name ?? 'N/A' },
        { label: 'Email', icon: '📧', value: user?.email ?? 'N/A' },
        {
          label: 'Goal',
          icon: '🎯',
          value: goal === 'fat_loss'
            ? 'Fat Loss 🔥'
            : goal === 'muscle_gain'
              ? 'Muscle Gain 💪'
              : goal === 'maintenance'
                ? 'Maintenance ⚖️'
                : 'Not set',
        },
        { label: 'Streak', icon: '🔥', value: `${streak} days` },
      ],
    },
    {
      title: '⚙️ Preferences',
      items: [
        {
          label: 'Dark Mode',
          icon: '🌙',
          rightContent: (
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
        {
          label: 'Notifications',
          icon: '🔔',
          rightContent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          ),
        },
      ],
    },
    {
      title: '⭐ Subscription',
      items: [
        {
          label: user?.isPremium ? 'Premium Plan' : 'Free Plan',
          icon: user?.isPremium ? '⭐' : '🔓',
          value: user?.isPremium ? 'Active' : 'Upgrade for AI features',
          onPress: !user?.isPremium
            ? () =>
                Alert.alert(
                  '🚀 Upgrade to Premium',
                  'Unlock AI Food Scanner, AI Insights, and more!',
                  [
                    { text: 'Not now', style: 'cancel' },
                    { text: 'Upgrade', onPress: () => {} },
                  ],
                )
            : undefined,
          color: user?.isPremium ? Colors.warning : undefined,
        },
        {
          label: 'AI Food Scanner',
          icon: '📸',
          value: user?.isPremium ? '✅ Unlocked' : '🔒 Premium',
          color: user?.isPremium ? Colors.primary : Colors.textSecondary,
        },
        {
          label: 'AI Insights',
          icon: '🧠',
          value: user?.isPremium ? '✅ Unlocked' : '🔒 Premium',
          color: user?.isPremium ? Colors.primary : Colors.textSecondary,
        },
      ],
    },
    {
      title: '❓ Support',
      items: [
        {
          label: 'Terms of Service',
          icon: '📄',
          onPress: () => Alert.alert('Terms of Service', 'View our terms at aicaloriestracker.com/terms'),
        },
        {
          label: 'Privacy Policy',
          icon: '🔒',
          onPress: () => Alert.alert('Privacy Policy', 'View our policy at aicaloriestracker.com/privacy'),
        },
        {
          label: 'Contact Support',
          icon: '💬',
          onPress: () => Alert.alert('Support', 'Email us at support@aicaloriestracker.com'),
        },
      ],
    },
  ];

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile 👤</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          {user?.isPremium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
            </View>
          ) : null}
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card padding={0}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.item,
                    idx < section.items.length - 1 && styles.itemBorder,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress && !item.rightContent}
                  activeOpacity={item.onPress ? 0.7 : 1}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>
                  {item.rightContent ? (
                    item.rightContent
                  ) : (
                    <Text
                      style={[
                        styles.itemValue,
                        item.color ? { color: item.color } : null,
                        item.onPress ? styles.itemValueLink : null,
                      ]}
                      numberOfLines={1}
                    >
                      {item.value ?? '→'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>AI Calories Tracker v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  content: { paddingHorizontal: Spacing.lg },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  userEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  premiumBadge: {
    marginTop: Spacing.sm,
    backgroundColor: '#FFF3E0',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  premiumBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.warning,
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  itemIcon: { fontSize: 20 },
  itemLabel: {
    fontSize: FontSize.base,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  itemValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    maxWidth: 150,
    textAlign: 'right',
  },
  itemValueLink: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  logoutButton: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.error,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});

export default ProfileScreen;
