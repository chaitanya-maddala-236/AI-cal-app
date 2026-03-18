import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing, Shadow } from '../../constants';
import { FoodEntry, ExerciseEntry } from '../../utils/types';

type ActivityItem = FoodEntry | ExerciseEntry;

interface ActivityItemCardProps {
  item: ActivityItem;
  onPress?: () => void;
}

function isFoodEntry(item: ActivityItem): item is FoodEntry {
  return 'mealType' in item;
}

const ActivityItemCard: React.FC<ActivityItemCardProps> = ({ item, onPress }) => {
  const isFood = isFoodEntry(item);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: isFood ? Colors.primaryLight : Colors.secondaryLight }]}>
        <Text style={styles.iconText}>{isFood ? '🍽' : '🏃'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>
          {isFood ? item.mealType : `${(item as ExerciseEntry).duration} min`}
        </Text>
      </View>
      <View style={styles.calories}>
        <Text style={[styles.calValue, { color: isFood ? Colors.text : Colors.error }]}>
          {isFood ? `+${item.calories}` : `-${(item as ExerciseEntry).caloriesBurned}`}
        </Text>
        <Text style={styles.calUnit}>kcal</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calories: {
    alignItems: 'flex-end',
  },
  calValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  calUnit: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});

export default ActivityItemCard;
