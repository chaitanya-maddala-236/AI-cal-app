import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SectionList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList, FoodEntry, ExerciseEntry } from '../../utils/types';
import { Card, LoadingState, EmptyState } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useDashboardStore } from '../../store';
import { getLogsByDate, deleteFoodEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';
import { formatDate } from '../../utils/helpers';
import { MEAL_TYPES, MealType } from '../../constants/api';

type DailyDetailScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'DailyDetail'>;
  route: RouteProp<HomeStackParamList, 'DailyDetail'>;
};

const DailyDetailScreen: React.FC<DailyDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { date } = route.params;
  const { dailyLogs, setDailyLog, removeFoodEntry } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const log = dailyLogs[date];

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLogsByDate(date);
      setDailyLog(date, data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleDelete = (item: FoodEntry) => {
    Alert.alert(
      'Delete Entry',
      `Remove "${item.name}" from your log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFoodEntry(item.id);
              removeFoodEntry(item.id, date);
            } catch (err) {
              Alert.alert('Error', getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  const sections = MEAL_TYPES.map((mealType: MealType) => ({
    title: mealType,
    data: log?.food.filter((f) => f.mealType === mealType) ?? [],
  }));

  const exercises = log?.exercises ?? [];

  if (isLoading) {
    return <LoadingState message="Loading your day..." />;
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{formatDate(date)}</Text>
        <View style={styles.headerRight} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {section.title === 'Breakfast' ? '🌅' :
               section.title === 'Lunch' ? '☀️' :
               section.title === 'Dinner' ? '🌙' : '🍎'} {section.title}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddMeal', { mealType: section.title as MealType })
              }
            >
              <Text style={styles.addBtn}>+ Add</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <Card style={styles.foodCard} padding={Spacing.md}>
            <View style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.macroText}>
                  P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                </Text>
              </View>
              <View style={styles.foodRight}>
                <Text style={styles.calories}>{item.calories} kcal</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate('EditEntry', { entry: item, type: 'food' })}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <EmptyState
              message={`No ${section.title.toLowerCase()} logged`}
              icon="🍽"
              style={styles.emptySectionState}
            />
          ) : null
        }
        ListFooterComponent={() => (
          <>
            {exercises.length > 0 ? (
              <View style={styles.exerciseSection}>
                <Text style={styles.sectionTitle}>🏃 Exercise</Text>
                {exercises.map((ex: ExerciseEntry) => (
                  <Card key={ex.id} style={styles.foodCard} padding={Spacing.md}>
                    <View style={styles.foodRow}>
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{ex.name}</Text>
                        <Text style={styles.macroText}>{ex.duration} min</Text>
                      </View>
                      <Text style={[styles.calories, { color: Colors.error }]}>
                        -{ex.caloriesBurned} kcal
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            ) : null}
            <View style={{ height: 100 }} />
          </>
        )}
      />
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
  headerRight: { width: 40 },
  content: { paddingHorizontal: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  addBtn: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  foodCard: { marginBottom: Spacing.sm },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodInfo: { flex: 1 },
  foodName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  macroText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  foodRight: { alignItems: 'flex-end' },
  calories: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  editBtn: {
    padding: Spacing.xs,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  editIcon: { fontSize: 16 },
  deleteIcon: { fontSize: 16 },
  emptySectionState: {
    height: 80,
    flex: undefined,
  },
  exerciseSection: { marginTop: Spacing.md },
});

export default DailyDetailScreen;
