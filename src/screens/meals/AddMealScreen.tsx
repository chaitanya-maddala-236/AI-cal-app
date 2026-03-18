import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../utils/types';
import { Button, Input } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useDashboardStore } from '../../store';
import { addFoodEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';
import { getTodayDateString } from '../../utils/helpers';
import { MEAL_TYPES, MealType } from '../../constants/api';

type AddMealScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AddMeal'>;
  route: RouteProp<HomeStackParamList, 'AddMeal'>;
};

const AddMealScreen: React.FC<AddMealScreenProps> = ({ navigation, route }) => {
  const { mealType: initialMealType } = route.params ?? {};
  const { addFoodEntry: addToStore } = useDashboardStore();

  const [selectedMealType, setSelectedMealType] = useState<MealType>(
    initialMealType ?? 'Breakfast',
  );
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Food name is required');
      return false;
    }
    const cal = parseFloat(calories);
    if (isNaN(cal) || cal < 0) {
      Alert.alert('Error', 'Enter valid calories');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) { return; }
    const date = getTodayDateString();
    setIsLoading(true);
    try {
      const entry = await addFoodEntry({
        name: foodName.trim(),
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        mealType: selectedMealType,
        date,
      });
      addToStore(entry);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Meal 🍽</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Meal Type Selection */}
        <Text style={styles.sectionLabel}>Meal Type</Text>
        <View style={styles.mealTypeRow}>
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.mealTypeBtn,
                selectedMealType === type && styles.mealTypeBtnSelected,
              ]}
              onPress={() => setSelectedMealType(type)}
            >
              <Text style={styles.mealTypeEmoji}>
                {type === 'Breakfast' ? '🌅' : type === 'Lunch' ? '☀️' : type === 'Dinner' ? '🌙' : '🍎'}
              </Text>
              <Text
                style={[
                  styles.mealTypeText,
                  selectedMealType === type && styles.mealTypeTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Food Details */}
        <View style={styles.form}>
          <Input
            label="Food Name"
            value={foodName}
            onChangeText={setFoodName}
            placeholder="e.g. Chicken Breast"
          />
          <Input
            label="Calories (kcal)"
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g. 300"
            keyboardType="decimal-pad"
          />

          <Text style={styles.macroTitle}>Macronutrients (optional)</Text>

          <View style={styles.macroRow}>
            <Input
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              placeholder="0"
              keyboardType="decimal-pad"
              containerStyle={styles.macroInput}
            />
            <Input
              label="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              placeholder="0"
              keyboardType="decimal-pad"
              containerStyle={styles.macroInput}
            />
            <Input
              label="Fat (g)"
              value={fat}
              onChangeText={setFat}
              placeholder="0"
              keyboardType="decimal-pad"
              containerStyle={styles.macroInput}
            />
          </View>
        </View>

        <Button
          title="Save Meal"
          onPress={handleSave}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: { padding: Spacing.lg, paddingTop: Spacing.sm },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  mealTypeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  mealTypeBtn: {
    flex: 1,
    minWidth: 70,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  mealTypeBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  mealTypeEmoji: { fontSize: 20 },
  mealTypeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  mealTypeTextSelected: { color: Colors.primaryDark },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  macroTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  macroRow: { flexDirection: 'row', gap: Spacing.sm },
  macroInput: { flex: 1, marginBottom: 0 },
});

export default AddMealScreen;
