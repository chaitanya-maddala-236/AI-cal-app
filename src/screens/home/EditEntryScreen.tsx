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
import { HomeStackParamList, FoodEntry, ExerciseEntry } from '../../utils/types';
import { Button, Input } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useDashboardStore } from '../../store';
import { updateFoodEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';

type EditEntryScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'EditEntry'>;
  route: RouteProp<HomeStackParamList, 'EditEntry'>;
};

const EditEntryScreen: React.FC<EditEntryScreenProps> = ({ navigation, route }) => {
  const { entry, type } = route.params;
  const { updateFoodEntry: updateInStore } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);

  const isFoodEntry = type === 'food';

  // Type-safe casting using conditional guard
  const entryCalories = isFoodEntry
    ? (entry as FoodEntry).calories
    : (entry as ExerciseEntry).caloriesBurned;

  const [name, setName] = useState(entry.name);
  const [calories, setCalories] = useState(entryCalories.toString());
  const [protein, setProtein] = useState(
    isFoodEntry ? (entry as FoodEntry).protein.toString() : '',
  );
  const [carbs, setCarbs] = useState(
    isFoodEntry ? (entry as FoodEntry).carbs.toString() : '',
  );
  const [fat, setFat] = useState(
    isFoodEntry ? (entry as FoodEntry).fat.toString() : '',
  );

  const handleSave = async () => {
    const cal = parseFloat(calories);
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (isNaN(cal) || cal < 0) {
      Alert.alert('Error', 'Enter valid calories');
      return;
    }

    const updates: Partial<FoodEntry> = {
      name: name.trim(),
      calories: cal,
    };

    if (isFoodEntry) {
      updates.protein = parseFloat(protein) || 0;
      updates.carbs = parseFloat(carbs) || 0;
      updates.fat = parseFloat(fat) || 0;
    }

    setIsLoading(true);
    try {
      await updateFoodEntry(entry.id, updates);
      updateInStore(entry.id, (entry as FoodEntry).date, updates);
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
        <Text style={styles.title}>Edit {type === 'food' ? 'Food' : 'Exercise'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label={type === 'food' ? 'Food Name' : 'Exercise Name'}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
          <Input
            label="Calories (kcal)"
            value={calories}
            onChangeText={setCalories}
            placeholder="e.g. 350"
            keyboardType="decimal-pad"
          />
          {isFoodEntry ? (
            <>
              <Input
                label="Protein (g)"
                value={protein}
                onChangeText={setProtein}
                placeholder="e.g. 20"
                keyboardType="decimal-pad"
              />
              <Input
                label="Carbs (g)"
                value={carbs}
                onChangeText={setCarbs}
                placeholder="e.g. 45"
                keyboardType="decimal-pad"
              />
              <Input
                label="Fat (g)"
                value={fat}
                onChangeText={setFat}
                placeholder="e.g. 12"
                keyboardType="decimal-pad"
              />
            </>
          ) : null}
        </View>

        <Button
          title="Save Changes"
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
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});

export default EditEntryScreen;
