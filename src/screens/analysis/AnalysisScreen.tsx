import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, LoadingState } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { getWeeklyAnalytics } from '../../services/aiService';
import { WeeklyAnalytics, WeeklyDataPoint } from '../../utils/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_MAX_HEIGHT = 120;

const BarChart: React.FC<{
  data: number[];
  labels: string[];
  color: string;
  maxValue?: number;
}> = ({ data, labels, color, maxValue }) => {
  const max = maxValue || Math.max(...data, 1);
  const barWidth = (SCREEN_WIDTH - Spacing.lg * 4 - Spacing.sm * (data.length - 1)) / data.length;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.bars}>
        {data.map((val, idx) => {
          const height = Math.max(4, (val / max) * BAR_MAX_HEIGHT);
          return (
            <View key={idx} style={[chartStyles.barWrapper, { width: barWidth }]}>
              <Text style={chartStyles.barValue}>{val > 0 ? Math.round(val) : ''}</Text>
              <View
                style={[
                  chartStyles.bar,
                  { height, backgroundColor: color },
                ]}
              />
              <Text style={chartStyles.barLabel}>{labels[idx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const chartStyles = StyleSheet.create({
  container: { marginVertical: Spacing.sm },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    height: BAR_MAX_HEIGHT + 50,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: BorderRadius.sm,
  },
  barValue: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_DATA: WeeklyAnalytics = {
  data: DAYS.map((_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    calories: [1800, 2100, 1950, 2200, 1700, 2300, 1900][i],
    water: [2200, 1800, 2500, 2000, 2400, 1600, 2100][i],
    protein: [85, 95, 100, 110, 80, 120, 90][i],
    carbs: [200, 230, 180, 250, 190, 270, 210][i],
    fat: [65, 70, 60, 75, 55, 80, 68][i],
    weight: [72.1, 72.0, 71.9, 72.1, 71.8, 71.7, 71.6][i],
  })),
  averageCalories: 1993,
  averageWater: 2086,
  weightChange: -0.5,
};

const AnalysisScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<WeeklyAnalytics>(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await getWeeklyAnalytics();
      setAnalytics(data);
    } catch {
      // Use mock data if API fails
      setAnalytics(MOCK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const caloriesData = analytics.data.map((d: WeeklyDataPoint) => d.calories);
  const waterData = analytics.data.map((d: WeeklyDataPoint) => d.water);
  const weightData = analytics.data.map((d: WeeklyDataPoint) => d.weight ?? 0);
  const proteinData = analytics.data.map((d: WeeklyDataPoint) => d.protein);
  const carbsData = analytics.data.map((d: WeeklyDataPoint) => d.carbs);
  const fatData = analytics.data.map((d: WeeklyDataPoint) => d.fat);

  if (isLoading && !analytics) {
    return <LoadingState message="Loading analytics..." />;
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis 📊</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchAnalytics}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Avg Calories', value: `${Math.round(analytics.averageCalories)}`, unit: 'kcal', color: Colors.calories },
            { label: 'Avg Water', value: `${Math.round(analytics.averageWater)}`, unit: 'ml', color: Colors.water },
            { label: 'Weight Change', value: analytics.weightChange > 0 ? `+${analytics.weightChange}` : `${analytics.weightChange}`, unit: 'kg', color: analytics.weightChange <= 0 ? Colors.primary : Colors.error },
          ].map((item) => (
            <View key={item.label} style={[styles.summaryCard, { borderTopColor: item.color }]}>
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.summaryUnit}>{item.unit}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Calories Chart */}
        <Card style={styles.chartCard} padding={Spacing.md}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>🔥 Calories This Week</Text>
            <Text style={styles.chartSubtitle}>Target: 2000 kcal</Text>
          </View>
          <BarChart
            data={caloriesData}
            labels={DAYS}
            color={Colors.calories}
            maxValue={2500}
          />
        </Card>

        {/* Water Chart */}
        <Card style={styles.chartCard} padding={Spacing.md}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>💧 Water Intake</Text>
            <Text style={styles.chartSubtitle}>Target: 2500 ml</Text>
          </View>
          <BarChart
            data={waterData}
            labels={DAYS}
            color={Colors.water}
            maxValue={3000}
          />
        </Card>

        {/* Weight Chart */}
        <Card style={styles.chartCard} padding={Spacing.md}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>⚖️ Weight Trend</Text>
            <Text style={[styles.chartSubtitle, { color: analytics.weightChange <= 0 ? Colors.primary : Colors.error }]}>
              {analytics.weightChange > 0 ? '+' : ''}{analytics.weightChange} kg this week
            </Text>
          </View>
          <BarChart
            data={weightData}
            labels={DAYS}
            color={Colors.accent}
            maxValue={80}
          />
        </Card>

        {/* Macro Distribution */}
        <Card style={styles.chartCard} padding={Spacing.md}>
          <Text style={styles.chartTitle}>📈 Macro Distribution</Text>
          <View style={styles.macroCharts}>
            <View style={styles.macroChart}>
              <Text style={styles.macroLabel}>Protein (g)</Text>
              <BarChart
                data={proteinData}
                labels={DAYS}
                color={Colors.protein}
                maxValue={150}
              />
            </View>
          </View>
          <View style={styles.macroCharts}>
            <View style={styles.macroChart}>
              <Text style={styles.macroLabel}>Carbs (g)</Text>
              <BarChart
                data={carbsData}
                labels={DAYS}
                color={Colors.carbs}
                maxValue={300}
              />
            </View>
          </View>
          <View style={styles.macroCharts}>
            <View style={styles.macroChart}>
              <Text style={styles.macroLabel}>Fat (g)</Text>
              <BarChart
                data={fatData}
                labels={DAYS}
                color={Colors.fat}
                maxValue={100}
              />
            </View>
          </View>
        </Card>

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
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  summaryValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  summaryUnit: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  chartCard: { marginBottom: Spacing.md },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  chartSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  macroCharts: { marginBottom: Spacing.sm },
  macroChart: {},
  macroLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
});

export default AnalysisScreen;
