import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, AIInsight } from '../../utils/types';
import { Card, LoadingState, ErrorState } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore, useUserProfileStore } from '../../store';
import { getAIInsights } from '../../services/aiService';
import { getErrorMessage } from '../../services/apiClient';

type AIInsightsScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AIInsights'>;
};

const AIInsightsScreen: React.FC<AIInsightsScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { goal } = useUserProfileStore();
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPremium = user?.isPremium ?? false;

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAIInsights();
      setInsights(data);
    } catch (err) {
      setError(getErrorMessage(err));
      // Show demo data if API fails
      setInsights({
        insight: 'You consumed 30% more carbs this week compared to your goal.',
        suggestion: goal === 'fat_loss'
          ? 'Try reducing carb intake. Replace rice with cauliflower rice or veggies.'
          : goal === 'muscle_gain'
            ? 'Great progress! Consider increasing protein to 150g per day for optimal muscle growth.'
            : 'Your calorie intake is on track. Keep maintaining this balance!',
        goal: goal || 'maintenance',
        trends: [
          'Protein intake was consistent throughout the week',
          'Water intake dropped on weekends',
          'Calorie intake peaked on Wednesday',
          'Breakfast was skipped 2 days this week',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !insights) {
    return <LoadingState message="Loading your insights..." />;
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Insights 🧠</Text>
        <View style={{ width: 40 }} />
      </View>

      {!isPremium ? (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumText}>🔒 Limited Preview — Upgrade for full insights</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchInsights}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {insights ? (
          <>
            {/* Insight Card */}
            <Card style={styles.insightCard} padding={Spacing.lg}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>💡</Text>
                <Text style={styles.cardTitle}>Weekly Insight</Text>
              </View>
              <Text style={styles.insightText}>{insights.insight}</Text>
            </Card>

            {/* Recommendation Card */}
            <Card style={styles.recommendCard} padding={Spacing.lg}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🎯</Text>
                <Text style={styles.cardTitle}>Recommendation</Text>
              </View>
              <View style={styles.goalBadge}>
                <Text style={styles.goalBadgeText}>
                  {insights.goal === 'fat_loss'
                    ? '🔥 Fat Loss'
                    : insights.goal === 'muscle_gain'
                      ? '💪 Muscle Gain'
                      : '⚖️ Maintenance'}
                </Text>
              </View>
              <Text style={styles.suggestionText}>{insights.suggestion}</Text>
            </Card>

            {/* Trends */}
            <Card style={styles.trendsCard} padding={Spacing.lg}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📊</Text>
                <Text style={styles.cardTitle}>This Week's Trends</Text>
              </View>
              {insights.trends.map((trend, idx) => (
                <View key={idx} style={styles.trendItem}>
                  <View style={styles.trendDot} />
                  <Text style={styles.trendText}>{trend}</Text>
                </View>
              ))}
            </Card>

            {/* Weekly Summary */}
            <Card style={styles.summaryCard} padding={Spacing.lg}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📅</Text>
                <Text style={styles.cardTitle}>Goal Progress</Text>
              </View>
              <View style={styles.goalGrid}>
                {[
                  { label: 'Days Logged', value: '5/7', color: Colors.primary },
                  { label: 'Goals Met', value: '4/7', color: Colors.success },
                  { label: 'Streak', value: '3 days', color: Colors.warning },
                  { label: 'Avg Calories', value: '1,850', color: Colors.info },
                ].map((item) => (
                  <View key={item.label} style={[styles.goalItem, { borderTopColor: item.color }]}>
                    <Text style={[styles.goalValue, { color: item.color }]}>{item.value}</Text>
                    <Text style={styles.goalLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        ) : error ? (
          <ErrorState message={error} />
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  backIcon: { fontSize: FontSize.xl, color: Colors.text },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  premiumBanner: {
    backgroundColor: '#FFF3E0',
    padding: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  premiumText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
  content: { padding: Spacing.lg, paddingTop: Spacing.sm },
  insightCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#E8F5E9',
  },
  recommendCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#E3F2FD',
  },
  trendsCard: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardIcon: { fontSize: 24 },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  insightText: {
    fontSize: FontSize.base,
    color: Colors.text,
    lineHeight: 24,
  },
  goalBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  goalBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  suggestionText: {
    fontSize: FontSize.base,
    color: Colors.text,
    lineHeight: 24,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  trendText: {
    fontSize: FontSize.base,
    color: Colors.text,
    flex: 1,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  goalItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderTopWidth: 3,
    alignItems: 'center',
  },
  goalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  goalLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default AIInsightsScreen;
