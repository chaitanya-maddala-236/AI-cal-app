import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../utils/types';
import { CalorieProgress } from '../../components/common/CircularProgress';
import { MacroCard, ActivityItemCard } from '../../components/home';
import { Card, EmptyState } from '../../components/common';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../constants';
import { useAuthStore, useDashboardStore, useUserProfileStore } from '../../store';
import { getDashboardToday } from '../../services/logService';
import { getGreeting } from '../../utils/helpers';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { dashboard, isLoading, setDashboard, setLoading, setError } =
    useDashboardStore();
  const { goal, streak } = useUserProfileStore();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardToday();
      setDashboard(data);
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [setDashboard, setLoading, setError]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const calories = dashboard?.caloriesConsumed ?? 0;
  const target = dashboard?.calorieTarget ?? 2000;
  const macros = dashboard?.macros ?? { protein: 0, carbs: 0, fat: 0 };
  const waterConsumed = dashboard?.waterConsumed ?? 0;
  const waterTarget = dashboard?.waterTarget ?? 2500;
  const recentActivity = dashboard?.recentActivity ?? [];
  const currentStreak = dashboard?.streak ?? streak ?? 0;

  const goalMessage =
    goal === 'fat_loss'
      ? 'Calorie Deficit Today 🔥'
      : goal === 'muscle_gain'
        ? 'Protein Intake Progress 💪'
        : 'Maintenance Mode ⚖️';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchDashboard}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.username}>
                {user?.name?.split(' ')[0] ?? 'User'} 👋
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => {}}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        {currentStreak > 0 ? (
          <Card style={styles.streakCard} padding={Spacing.md}>
            <View style={styles.streakRow}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakText}>
                {currentStreak}-day streak! Keep it up!
              </Text>
            </View>
          </Card>
        ) : null}

        {/* Goal Badge */}
        <View style={styles.goalBadge}>
          <Text style={styles.goalText}>{goalMessage}</Text>
        </View>

        {/* Calorie Progress */}
        <Card style={styles.calorieCard}>
          <View style={styles.progressRow}>
            <CalorieProgress
              consumed={calories}
              target={target}
              size={180}
              goal={goal ?? undefined}
            />
            <View style={styles.calorieDetails}>
              <View style={styles.calStatRow}>
                <View
                  style={[styles.calDot, { backgroundColor: Colors.primary }]}
                />
                <View>
                  <Text style={styles.calStatLabel}>Goal</Text>
                  <Text style={styles.calStatValue}>
                    {target.toLocaleString()} kcal
                  </Text>
                </View>
              </View>
              <View style={styles.calStatRow}>
                <View
                  style={[styles.calDot, { backgroundColor: Colors.secondary }]}
                />
                <View>
                  <Text style={styles.calStatLabel}>Consumed</Text>
                  <Text style={styles.calStatValue}>
                    {calories.toLocaleString()} kcal
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Macros */}
        <Text style={styles.sectionTitle}>Macros Today</Text>
        <View style={styles.macrosGrid}>
          <MacroCard
            label="Protein"
            value={macros.protein}
            unit="g"
            target={goal === 'muscle_gain' ? 150 : 100}
            color={Colors.protein}
            icon="🥩"
          />
          <MacroCard
            label="Carbs"
            value={macros.carbs}
            unit="g"
            target={goal === 'fat_loss' ? 150 : 250}
            color={Colors.carbs}
            icon="🌾"
          />
        </View>
        <View style={styles.macrosGrid}>
          <MacroCard
            label="Fat"
            value={macros.fat}
            unit="g"
            target={70}
            color={Colors.fat}
            icon="🥑"
          />
          <MacroCard
            label="Water"
            value={waterConsumed}
            unit="ml"
            target={waterTarget}
            color={Colors.water}
            icon="💧"
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DailyDetail', {
                date: new Date().toISOString().split('T')[0],
              })
            }
          >
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {recentActivity.length === 0 ? (
          <EmptyState
            message="No activity yet. Start logging meals!"
            icon="🍽"
            style={styles.emptyState}
          />
        ) : (
          recentActivity.slice(0, 5).map((item) => (
            <ActivityItemCard
              key={item.id}
              item={item}
              onPress={() =>
                navigation.navigate('DailyDetail', {
                  date: new Date().toISOString().split('T')[0],
                })
              }
            />
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  greeting: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  username: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  notificationIcon: { fontSize: 20 },
  streakCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFF3E0',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakFire: { fontSize: 24 },
  streakText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.secondary,
  },
  goalBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  goalText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  calorieCard: {
    marginBottom: Spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  calorieDetails: {
    flex: 1,
    gap: Spacing.md,
  },
  calStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  calDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },
  calStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  calStatValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  emptyState: {
    height: 150,
    flex: undefined,
  },
  bottomPadding: { height: 100 },
});

export default HomeScreen;
